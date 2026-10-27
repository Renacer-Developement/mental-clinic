// Proposes an SEO refresh of a published article: new content, excerpt, tags, related tests,
// cover. The rewrite waits in article.refreshProposal and goes to the support bot, where
// Застосувати puts it on the site. The title (and so the URL) never changes.
// Used by the scheduled refresh task.
//
//   node scripts/update-article.js --pick <out.json> [--min-days 60]
//       writes the published article refreshed longest ago (and not within min-days) to out.json
//   node scripts/update-article.js <article.json> [--dry-run]
//       saves it as a proposal and sends it to the support bot for approval
//   node scripts/update-article.js --notify <article id>   (re-send a pending proposal)
//
// article.json: what --pick wrote, edited, plus "changes": a short Ukrainian note on what changed.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const Article = require('../src/models/article.model');
const Test = require('../src/models/test.model');
const { notifyRefreshForReview } = require('../src/services/article-review-telegram.service');
const { checkArticleInput, findRelatedTests, countWords } = require('./article-input');

const DAY = 24 * 60 * 60 * 1000;
const fail = (msg) => { console.error(`Error: ${msg}`); process.exit(1); };

async function pick(outFile, minDays) {
    const articles = await Article.find({ status: 'published' }).lean();
    // A dropped rewrite also counts as a touch, so the same article isn't proposed again next week
    const lastTouched = (a) => Math.max(...[a.refreshedAt, a.refreshProposal?.proposedAt, a.publishedAt, a.createdAt]
        .filter(Boolean).map(d => new Date(d).getTime()));
    const pending = articles.filter(a => a.refreshProposal?.status === 'pending');
    if (pending.length) console.log(`Waiting for a decision in the bot: ${pending.map(a => `"${a.title}"`).join(', ')}`);
    const due = articles
        .filter(a => a.refreshProposal?.status !== 'pending' && Date.now() - lastTouched(a) >= minDays * DAY)
        .sort((a, b) => lastTouched(a) - lastTouched(b));
    if (!due.length) {
        console.log(`Nothing to refresh: every published article is newer than ${minDays} days`);
        return;
    }
    const a = due[0];
    const tests = await Test.find({ _id: { $in: a.relatedTests } }, { slug: 1 }).lean();
    const out = {
        id: String(a._id),
        title: a.title,
        excerpt: a.excerpt ?? '',
        content: a.content,
        categories: a.categories ?? [],
        tags: a.tags ?? [],
        relatedTests: tests.map(t => t.slug),
        coverImage: a.coverImage ?? null,
        changes: '',
    };
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
    console.log(`Picked: ${a._id} "${a.title}" → /${a.slug}, published ${a.publishedAt?.toISOString().slice(0, 10)}, `
        + `refreshed ${a.refreshedAt?.toISOString().slice(0, 10) ?? 'never'}, ${a.views} views, ${countWords(a.content)} words`);
    console.log(`Written to ${outFile} (${due.length} article(s) due)`);
}

async function save(file, dryRun) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!/^[0-9a-f]{24}$/i.test(data.id ?? '')) fail('"id" is missing — start from the file --pick wrote');
    if (!data.changes?.trim()) fail('"changes" is empty — say in a sentence what was updated');
    const error = checkArticleInput(data, ['excerpt', 'content']);
    if (error) fail(error);

    const article = await Article.findById(data.id);
    if (!article) fail(`no article with id ${data.id}`);
    if (article.status !== 'published') fail(`article ${data.id} is ${article.status}, not published`);
    // A new title would change the slug and break the URL Google has indexed
    if (data.title && data.title.trim() !== article.title.trim()) fail('the title must stay the same (it sets the URL)');

    const tests = await findRelatedTests(data.relatedTests);
    const words = countWords(data.content);
    if (dryRun) {
        console.log(`Dry run OK: "${article.title}" → /${article.slug}, ${countWords(article.content)} → ${words} words, ${tests.length} related tests`);
        return;
    }

    if (article.refreshProposal?.status === 'pending') fail('a refresh of this article is already waiting for a decision in the bot');

    article.refreshProposal = {
        excerpt: data.excerpt.trim(),
        content: data.content,
        categories: data.categories ?? article.categories,
        tags: data.tags ?? article.tags,
        relatedTests: tests.map(t => t._id),
        coverImage: data.coverImage || undefined,
        changes: data.changes.trim(),
        status: 'pending',
        proposedAt: new Date(),
    };
    await article.save();
    console.log(`Refresh proposed: ${article._id} "${article.title}" (slug ${article.slug}), ${words} words`);
    await sendForReview(article);
}

/** A Telegram failure keeps the proposal: resend it with --notify. */
async function sendForReview(article) {
    try {
        await notifyRefreshForReview(article);
        console.log(`Telegram: sent for approval to ${article.refreshProposal.tgReview.length} chat(s)`);
    } catch (err) {
        console.log(`Telegram: NOT sent — ${err.message}. Resend with: node scripts/update-article.js --notify ${article._id}`);
    }
    if (article.refreshProposal.tgReview?.length) await article.save();
}

async function main() {
    const args = process.argv.slice(2);
    if (!args[0]) fail('usage: node scripts/update-article.js --pick <out.json> [--min-days 60] | <article.json> [--dry-run] | --notify <article id>');

    await mongoose.connect(process.env.MONGODB_URI);
    try {
        if (args[0] === '--pick') {
            if (!args[1]) fail('--pick needs an output file');
            const i = args.indexOf('--min-days');
            await pick(args[1], i > -1 ? Number(args[i + 1]) : 60);
        } else if (args[0] === '--notify') {
            const article = /^[0-9a-f]{24}$/i.test(args[1] ?? '') ? await Article.findById(args[1]) : null;
            if (article?.refreshProposal?.status !== 'pending') fail(`no pending refresh for article ${args[1]}`);
            await sendForReview(article);
        } else {
            await save(args[0], args.includes('--dry-run'));
        }
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => fail(err.message));
