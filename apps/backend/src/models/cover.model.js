const mongoose = require('mongoose');

// An article cover made by apps/frontend/scripts/make-article-cover.py, stored here so a new
// cover goes live without a frontend deploy. Served by /api/covers/<slug>.webp|.jpg.
const coverSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9-]+$/ },
    webp: { type: Buffer, required: true }, // 2400×1260, shown on the site
    jpg:  { type: Buffer, required: true }, // 1200×630, share previews (og:image)
}, { timestamps: true });

module.exports = mongoose.model('Cover', coverSchema);
