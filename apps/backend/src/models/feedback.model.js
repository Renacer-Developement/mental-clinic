const mongoose = require('mongoose');

// A "call me back" request from the public site's feedback form.
const feedbackSchema = new mongoose.Schema({
    name:          { type: String, required: true, trim: true, maxlength: 100 },
    phone:         { type: String, required: true, trim: true, maxlength: 30 },
    contactMethod: { type: String, enum: ['phone', 'telegram', 'viber'], default: 'phone' },
    message:       { type: String, trim: true, maxlength: 2000, default: '' },
    pagePath:      { type: String, trim: true, maxlength: 300, default: '' },
    status:        { type: String, enum: ['new', 'in_progress', 'done', 'spam'], default: 'new', index: true },
    note:          { type: String, trim: true, maxlength: 2000, default: '' }, // staff only
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
