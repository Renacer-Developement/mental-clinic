// Text → vector via Voyage AI. voyage-3.5-lite handles Ukrainian well and returns
// 1024-dim vectors; documents and queries are embedded with different input_type,
// which Voyage tunes for retrieval.

const VOYAGE_URL = 'https://api.voyageai.com/v1/embeddings';
const MODEL      = 'voyage-3.5-lite';
const DIMENSIONS = 1024;
const BATCH      = 64;

const isEnabled = () => Boolean(process.env.VOYAGE_API_KEY);

const embedBatch = async (texts, inputType) => {
    const res = await fetch(VOYAGE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
        },
        body: JSON.stringify({ input: texts, model: MODEL, input_type: inputType }),
        signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) throw new Error(`Voyage ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const { data } = await res.json();
    return data.sort((a, b) => a.index - b.index).map(d => d.embedding);
};

/** @param {'document'|'query'} inputType */
const embed = async (texts, inputType) => {
    if (!isEnabled()) throw new Error('VOYAGE_API_KEY is not set');
    const out = [];
    for (let i = 0; i < texts.length; i += BATCH) {
        out.push(...await embedBatch(texts.slice(i, i + BATCH), inputType));
    }
    return out;
};

// The same few queries ("депресія", "тест на тривогу") repeat a lot.
const queryCache = new Map();
const QUERY_CACHE_SIZE = 500;

const embedQuery = async (query) => {
    const key = query.toLowerCase();
    if (queryCache.has(key)) return queryCache.get(key);
    const [vector] = await embed([query], 'query');
    if (queryCache.size >= QUERY_CACHE_SIZE) queryCache.delete(queryCache.keys().next().value);
    queryCache.set(key, vector);
    return vector;
};

module.exports = { isEnabled, embed, embedQuery, MODEL, DIMENSIONS };
