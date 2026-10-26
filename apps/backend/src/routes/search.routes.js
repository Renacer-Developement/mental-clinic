const { Router } = require('express');
const searchService = require('../services/search.service');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = Router();

// Every query can cost a Voyage call, so cap each visitor at 30 a minute.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 30;
const hits = new Map();

const rateLimit = (req, res, next) => {
    const ip = String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim();
    const now = Date.now();
    const entry = hits.get(ip);
    if (!entry || now - entry.start > WINDOW_MS) {
        if (hits.size > 10_000) hits.clear();
        hits.set(ip, { start: now, count: 1 });
        return next();
    }
    if (++entry.count > MAX_PER_WINDOW) {
        return res.status(429).json({ message: 'Забагато запитів. Спробуйте за хвилину.' });
    }
    next();
};

// Public
router.get('/', rateLimit, async (req, res, next) => {
    try {
        const q = String(req.query.q ?? '').trim().slice(0, 200);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 30);
        if (q.length < 2) return res.json({ results: [], mode: 'keyword' });
        res.json(await searchService.search(q, limit));
    } catch (err) { next(err); }
});

// Admin: rebuild now instead of waiting for the hourly run (e.g. right after publishing)
router.post('/reindex', authenticate, requireAdmin, async (req, res, next) => {
    try { res.json(await searchService.reindex()); }
    catch (err) { next(err); }
});

module.exports = router;
