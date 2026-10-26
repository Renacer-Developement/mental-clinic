const mongoose = require('mongoose');

// One searchable piece of the site: an article paragraph group, a test, or a
// static page. Search returns the best chunk per page (url).
const searchChunkSchema = new mongoose.Schema({
    kind:      { type: String, enum: ['article', 'test', 'page'], required: true },
    url:       { type: String, required: true, index: true },
    title:     { type: String, required: true },
    snippet:   { type: String },
    text:      { type: String, required: true },
    // sha1 of text + model: unchanged chunks keep their vector on reindex
    hash:      { type: String, required: true, unique: true },
    // Empty until Voyage is configured; keyword search still works without it
    embedding: { type: [Number], default: undefined },
}, { timestamps: true });

module.exports = mongoose.model('SearchChunk', searchChunkSchema);
