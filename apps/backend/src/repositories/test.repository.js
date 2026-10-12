const Test = require('../models/test.model');

const LIST_FIELDS = '_id name description type specialTest duration slug updatedAt';

class TestRepository {
    create(data) {
        return new Test(data).save();
    }

    findAll(filter) {
        return Test.find(filter).select(LIST_FIELDS);
    }

    findById(id) {
        return Test.findById(id);
    }

    findBySlug(slug) {
        return Test.findOne({ slug });
    }

    findWithoutSlug() {
        return Test.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: '' }] }).select('_id name');
    }

    findSlugs() {
        return Test.find({ slug: { $type: 'string' } }).select('slug');
    }

    setSlug(id, slug) {
        return Test.updateOne({ _id: id }, { $set: { slug } });
    }

    updateById(id, data) {
        return Test.findByIdAndUpdate(id, data, { new: true });
    }

    deleteById(id) {
        return Test.findByIdAndDelete(id);
    }
}

module.exports = new TestRepository();
