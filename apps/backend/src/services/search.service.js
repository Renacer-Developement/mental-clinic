const crypto = require('crypto');
const Article = require('../models/article.model');
const Test = require('../models/test.model');
const SearchChunk = require('../models/search-chunk.model');
const embedding = require('./embedding.service');

// Site search: hybrid of vector similarity (meaning) and keyword matches (exact
// terms like "PHQ-9"), fused by reciprocal rank. The whole index is a few hundred
// chunks, so it lives in memory and vectors are compared exactly — no Atlas
// vector index to manage. Switch to $vectorSearch if it ever grows past ~50k chunks.

const SITE = process.env.SITE_URL || 'https://doctor-skripnik.com.ua';
const CHUNK_CHARS = 900;
const SNIPPET_CHARS = 220;

/** @type {{ kind: string, url: string, title: string, snippet: string, text: string, lower: string, embedding?: number[] }[]} */
let chunks = [];
let reindexing = null;

// ── Building chunks ───────────────────────────────────────────────────────────

const stripHtml = html => String(html || '')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|h[1-6]|li|blockquote|tr|div)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[ \t]+/g, ' ');

const clip = (s, n) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n) > n * 0.6 ? s.lastIndexOf(' ', n) : n) + '…');

/** Paragraphs grouped into pieces of up to CHUNK_CHARS. */
const splitText = (text) => {
    const paras = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 1);
    const out = [];
    let cur = '';
    for (const p of paras) {
        if (cur && cur.length + p.length + 1 > CHUNK_CHARS) { out.push(cur); cur = ''; }
        cur = cur ? `${cur}\n${p}` : p;
    }
    if (cur) out.push(cur);
    return out;
};

const articleChunks = async () => {
    const articles = await Article.find({ status: 'published' })
        .select('title excerpt content slug').lean();
    return articles.flatMap(a => {
        const url = `/articles/${a.slug ?? a._id}`;
        const body = splitText(stripHtml(a.content));
        const pieces = [a.excerpt ? `${a.excerpt}\n${body[0] ?? ''}` : body[0] ?? '', ...body.slice(1)].filter(Boolean);
        // The title goes into every piece so a paragraph keeps its topic
        return pieces.map((p, i) => ({
            kind: 'article', url, title: a.title,
            snippet: clip(i === 0 && a.excerpt ? a.excerpt : p.replace(/\n/g, ' '), SNIPPET_CHARS),
            text: `${a.title}\n${p}`,
        }));
    });
};

const testChunks = async () => {
    const tests = await Test.find().select('name description whyTest instructions slug').lean();
    return tests.map(t => ({
        kind: 'test',
        url: `/test/detail/${t.slug ?? t._id}`,
        title: t.name,
        snippet: clip(t.description || t.whyTest || '', SNIPPET_CHARS),
        text: [t.name, t.description, t.whyTest, t.instructions].filter(Boolean).join('\n'),
    }));
};

/** Static pages live in the frontend code; it publishes them as JSON (see server.ts). */
const pageChunks = async () => {
    try {
        const res = await fetch(`${SITE}/search-pages.json`, { signal: AbortSignal.timeout(15_000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const pages = await res.json();
        return pages.flatMap(p => (p.sections?.length ? p.sections : [p.text]).map(text => ({
            kind: 'page', url: p.url, title: p.title,
            snippet: clip(p.snippet || text, SNIPPET_CHARS),
            text: `${p.title}\n${text}`,
        })));
    } catch (err) {
        console.warn('search: static pages skipped —', err.message);
        return null; // keep the pages already indexed rather than dropping them
    }
};

const hashOf = c => crypto.createHash('sha1').update(`${embedding.MODEL}\n${c.url}\n${c.text}`).digest('hex');

// ── Index maintenance ─────────────────────────────────────────────────────────

const loadIntoMemory = async () => {
    const docs = await SearchChunk.find().select('kind url title snippet text embedding').lean();
    chunks = docs.map(d => ({ ...d, lower: `${d.title}\n${d.text}`.toLowerCase() }));
};

const doReindex = async () => {
    const [articles, tests, pages] = await Promise.all([articleChunks(), testChunks(), pageChunks()]);
    const fresh = [...articles, ...tests, ...(pages ?? [])].map(c => ({ ...c, hash: hashOf(c) }));
    const freshHashes = new Set(fresh.map(c => c.hash));

    const existing = await SearchChunk.find().select('hash kind embedding').lean();
    const existingByHash = new Map(existing.map(d => [d.hash, d]));

    // Drop chunks whose source changed or disappeared (pages too, unless their fetch failed)
    const stale = existing.filter(d => !freshHashes.has(d.hash) && (pages !== null || d.kind !== 'page'));
    if (stale.length) await SearchChunk.deleteMany({ _id: { $in: stale.map(d => d._id) } });

    const toInsert = fresh.filter(c => !existingByHash.has(c.hash));
    if (toInsert.length) await SearchChunk.insertMany(toInsert, { ordered: false });

    let embedded = 0;
    if (embedding.isEnabled()) {
        const missing = await SearchChunk.find({ embedding: { $exists: false } }).select('text').lean();
        if (missing.length) {
            const vectors = await embedding.embed(missing.map(m => m.text), 'document');
            await SearchChunk.bulkWrite(missing.map((m, i) => ({
                updateOne: { filter: { _id: m._id }, update: { $set: { embedding: vectors[i] } } },
            })));
            embedded = missing.length;
        }
    }

    await loadIntoMemory();
    return { total: chunks.length, added: toInsert.length, removed: stale.length, embedded, vectors: embedding.isEnabled() };
};

/** Hash-based, so a run with no content changes costs a few reads and no API calls. */
const reindex = () => {
    reindexing ??= doReindex().finally(() => { reindexing = null; });
    return reindexing;
};

// ── Querying ──────────────────────────────────────────────────────────────────

const cosine = (a, b) => {
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return dot / (Math.sqrt(na * nb) || 1);
};

const escapeRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Words of 2+ letters; Ukrainian endings vary a lot, so long words match on their stem. */
const terms = q => q.toLowerCase().split(/[^\p{L}\p{N}-]+/u)
    .filter(w => w.length >= 2)
    .map(w => (w.length > 5 ? w.slice(0, w.length - 2) : w));

const keywordScores = (q) => {
    const ts = terms(q);
    if (!ts.length) return new Map();
    const scores = new Map();
    chunks.forEach((c, i) => {
        const title = c.title.toLowerCase();
        let s = 0;
        for (const t of ts) {
            const hits = c.lower.match(new RegExp(escapeRegex(t), 'g'))?.length ?? 0;
            if (hits) s += Math.min(hits, 5) + (title.includes(t) ? 5 : 0);
        }
        if (s) scores.set(i, s);
    });
    return scores;
};

const rank = scores => new Map([...scores.entries()].sort((a, b) => b[1] - a[1]).map(([i], r) => [i, r]));

const RRF_K = 60;
const MIN_VECTOR_SCORE = 0.3;

/**
 * @returns {{ results: { kind, url, title, snippet, score }[], mode: 'hybrid'|'keyword' }}
 */
const search = async (q, limit = 10) => {
    if (!chunks.length) await loadIntoMemory();

    const kwRanks = rank(keywordScores(q));
    let vecRanks = new Map();
    let mode = 'keyword';

    if (embedding.isEnabled() && chunks.some(c => c.embedding)) {
        try {
            const qv = await embedding.embedQuery(q);
            const sims = new Map();
            chunks.forEach((c, i) => {
                if (!c.embedding) return;
                const s = cosine(qv, c.embedding);
                if (s >= MIN_VECTOR_SCORE) sims.set(i, s);
            });
            vecRanks = rank(sims);
            mode = 'hybrid';
        } catch (err) {
            console.warn('search: vector part skipped —', err.message);
        }
    }

    // Reciprocal rank fusion; vector matches only count in their top 50
    const fused = new Map();
    for (const [i, r] of kwRanks) fused.set(i, (fused.get(i) ?? 0) + 1 / (RRF_K + r));
    for (const [i, r] of vecRanks) if (r < 50) fused.set(i, (fused.get(i) ?? 0) + 1 / (RRF_K + r));

    // Best chunk per page
    const byUrl = new Map();
    for (const [i, score] of [...fused.entries()].sort((a, b) => b[1] - a[1])) {
        const c = chunks[i];
        if (!byUrl.has(c.url)) byUrl.set(c.url, { kind: c.kind, url: c.url, title: c.title, snippet: c.snippet, score: Number(score.toFixed(5)) });
    }
    return { results: [...byUrl.values()].slice(0, limit), mode };
};

module.exports = { search, reindex };
