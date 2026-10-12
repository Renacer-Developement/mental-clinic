const mongoose = require('mongoose');
const crypto = require('crypto');
const testRepository = require('../repositories/test.repository');
const { ukrainianToSlug } = require('../utils/slug');

const generateRandomName = () => crypto.randomBytes(8).toString('hex');

const buildFilter = ({ searchKeyword, type } = {}) => {
    const filter = {};
    if (searchKeyword) {
        filter.$or = [
            { name:        { $regex: new RegExp(searchKeyword, 'i') } },
            { description: { $regex: new RegExp(searchKeyword, 'i') } },
        ];
    }
    if (type) filter.type = type;
    return filter;
};

const enrichQuestions = (questions, isNew) =>
    questions.map(q => ({
        _id:  isNew ? new mongoose.Types.ObjectId() : (q._id || new mongoose.Types.ObjectId()),
        name: isNew ? generateRandomName() : (q.name || generateRandomName()),
        ...q,
    }));

const freeSlug = (base, taken) => {
    let slug = base;
    for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    return slug;
};

/**
 * Gives every test that predates slugs a unique one. Runs on the first list
 * request after a deploy; once all tests have slugs it's a single empty query.
 */
let slugsBackfilled = null;
const backfillSlugs = async () => {
    const missing = await testRepository.findWithoutSlug();
    if (!missing.length) return;
    const taken = new Set((await testRepository.findSlugs()).map(t => t.slug));
    for (const test of missing) {
        const base = ukrainianToSlug(test.name) || String(test._id);
        const slug = freeSlug(base, taken);
        taken.add(slug);
        await testRepository.setSlug(test._id, slug);
    }
};

const notFound = () => Object.assign(new Error('Test not found'), { statusCode: 404 });

class TestService {
    async create(data) {
        if (Array.isArray(data.questions)) {
            data.questions = enrichQuestions(data.questions, true);
        }
        if (!data.slug && data.name) {
            const taken = new Set((await testRepository.findSlugs()).map(t => t.slug));
            data.slug = freeSlug(ukrainianToSlug(data.name), taken);
        }
        return testRepository.create(data);
    }

    async getAll(query) {
        slugsBackfilled ??= backfillSlugs().catch(err => {
            slugsBackfilled = null; // retry on the next request
            console.error('Test slug backfill failed:', err);
        });
        await slugsBackfilled;
        return testRepository.findAll(buildFilter(query));
    }

    /** Accepts a MongoDB _id (old URLs, admin) or a slug (public URLs). */
    async getById(idOrSlug) {
        const test = mongoose.isValidObjectId(idOrSlug) && /^[0-9a-f]{24}$/i.test(idOrSlug)
            ? await testRepository.findById(idOrSlug)
            : await testRepository.findBySlug(idOrSlug);
        if (!test) throw notFound();
        return test;
    }

    async update(id, data) {
        if (Array.isArray(data.questions)) {
            data.questions = enrichQuestions(data.questions, false);
        }
        const test = await testRepository.updateById(id, data);
        if (!test) throw notFound();
        return test;
    }

    async delete(id) {
        const test = await testRepository.deleteById(id);
        if (!test) throw notFound();
    }
}

module.exports = new TestService();
