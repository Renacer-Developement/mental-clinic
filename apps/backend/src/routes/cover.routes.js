const { Router } = require('express');
const Cover = require('../models/cover.model');

const router = Router();
const TYPES = { webp: 'image/webp', jpg: 'image/jpeg' };

// GET /api/covers/<slug>.webp|.jpg — article covers kept in the database (see cover.model.js).
// Cached for a day; the ETag changes when a cover is redrawn, so revalidation picks it up.
router.get('/:file', async (req, res, next) => {
    try {
        const m = /^([a-z0-9-]+)\.(webp|jpg)$/.exec(req.params.file);
        if (!m) return res.sendStatus(404);
        const [, slug, ext] = m;

        const cover = await Cover.findOne({ slug }, { [ext]: 1, updatedAt: 1 }).lean();
        if (!cover) return res.sendStatus(404);

        const etag = `"${slug}-${ext}-${new Date(cover.updatedAt).getTime()}"`;
        res.set({
            'Content-Type': TYPES[ext],
            'Cache-Control': 'public, max-age=86400',
            ETag: etag,
            'Cross-Origin-Resource-Policy': 'cross-origin',
        });
        if (req.get('If-None-Match') === etag) return res.sendStatus(304);
        res.send(Buffer.from(cover[ext].buffer ?? cover[ext]));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
