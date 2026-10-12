const mongoose = require('mongoose');
const { ukrainianToSlug } = require('../utils/slug');

// ── Schema ────────────────────────────────────────────────────────────────────

const articleSchema = new mongoose.Schema(
    {
        title:      { type: String, required: true },
        content:    { type: String, required: true },
        excerpt:    { type: String },
        categories: [{ type: String }],
        tags:       [{ type: String }],
        status:     { type: String, enum: ['draft', 'published'], default: 'draft' },
        coverImage: { type: String },
        author:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        authorName:   { type: String },
        relatedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
        publishedAt:{ type: Date },
        slug:       { type: String, unique: true, sparse: true, index: true },
        views:      { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        readTime:   { type: Number },
    },
    { timestamps: true }
);

// ── Pre-save hooks ────────────────────────────────────────────────────────────

articleSchema.pre('save', function () {
    if (this.isModified('title') || !this.slug) {
        this.slug = ukrainianToSlug(this.title);
    }

    if (this.isModified('content') || !this.readTime) {
        const words = (this.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
        this.readTime = Math.max(1, Math.ceil(words / 200));
    }

    if (this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
});

// Export helper so migration scripts can reuse it
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
module.exports.ukrainianToSlug = ukrainianToSlug;
