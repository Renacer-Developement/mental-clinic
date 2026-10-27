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
        // Review of auto-written drafts in the support bot: the summary message with the
        // Опублікувати / Відхилити buttons in each staff chat, and who rejected the draft
        tgReview:       [{ _id: false, chatId: String, messageId: Number }],
        rejectedAt:     { type: Date },
        rejectedByName: { type: String },
        // Last content refresh by scripts/update-article.js (updatedAt also moves on every view)
        refreshedAt:    { type: Date },
        // A rewrite proposed by scripts/update-article.js, applied or dropped with the support
        // bot's buttons. Kept after the decision so the next refresh skips this article for a while.
        refreshProposal: {
            excerpt:      String,
            content:      String,
            categories:   [String],
            tags:         [String],
            relatedTests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Test' }],
            coverImage:   String,
            changes:      String,
            status:       { type: String, enum: ['pending', 'applied', 'rejected'] },
            proposedAt:   Date,
            decidedAt:    Date,
            decidedByName: String,
            tgReview:     [{ _id: false, chatId: String, messageId: Number }],
        },
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
