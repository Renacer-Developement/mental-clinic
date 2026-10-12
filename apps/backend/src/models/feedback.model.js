const mongoose = require('mongoose');

// A "call me back" request from the public site's feedback form.
const feedbackSchema = new mongoose.Schema({
    specialist:    { type: String, enum: ['doctor', 'psychologist'], default: 'doctor', index: true },
    name:          { type: String, required: true, trim: true, maxlength: 100 },
    phone:         { type: String, required: true, trim: true, maxlength: 30 },
    contactMethod: { type: String, enum: ['phone', 'telegram', 'viber'], default: 'phone' },
    message:       { type: String, trim: true, maxlength: 2000, default: '' },
    pagePath:      { type: String, trim: true, maxlength: 300, default: '' },
    status:        { type: String, enum: ['new', 'in_progress', 'done', 'spam'], default: 'new', index: true },
    note:          { type: String, trim: true, maxlength: 2000, default: '' }, // staff only
    // Who marked the request done («Передзвонили») and when
    closedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    closedByName:  { type: String, default: '' },
    closedAt:      { type: Date },
    // The Telegram notification, so its text and buttons can follow status changes
    tgChatId:      { type: String },
    tgMessageId:   { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
