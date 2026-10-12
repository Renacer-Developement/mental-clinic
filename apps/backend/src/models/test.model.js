const mongoose = require('mongoose');
const { ukrainianToSlug } = require('../utils/slug');

const questionSchema = new mongoose.Schema({
    question:  { type: String },
    example:   { type: String },
    labelText: [{ type: String, required: true }],
    value:     [{ type: Number, required: true }],
});

const interpretationSchema = new mongoose.Schema({
    range:         [{ type: Number }],
    result:        { type: String },
    name:          { type: String },
    type:          { type: String },
    questionIndex: [{ type: Number }],
});

const spectraSchema = new mongoose.Schema({
    factor:         { type: Number },
    name:           { type: String },
    questions:      [{ type: Number }],
    interpretation: { type: String },
});

const testSchema = new mongoose.Schema({
    name:                { type: String, required: true },
    description:         { type: String, required: true },
    type:                { type: String, required: true },
    specialTest:         { type: String, required: true },
    duration:            { type: String, required: true },
    instructions:        { type: String, required: true },
    whyTest:             { type: String, required: true },
    pdfLink:             { type: String, required: true },
    questions:           [questionSchema],
    commonMessage:       { type: String, required: true },
    resultInterpretation:[interpretationSchema],
    factor:              [spectraSchema],
    // Public URL key (/test/detail/<slug>). Set once from the name and never
    // regenerated, so renaming a test doesn't break links that Google indexed.
    slug:                { type: String, unique: true, sparse: true, index: true },
}, {
    // updatedAt feeds <lastmod> in the sitemap. Tests saved before this existed
    // have none until their next edit — better no date than an invented one.
    timestamps: true,
});

testSchema.pre('save', function () {
    if (!this.slug) this.slug = ukrainianToSlug(this.name);
});

module.exports = mongoose.model('Test', testSchema);
