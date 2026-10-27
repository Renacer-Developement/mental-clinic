// Checks shared by the scheduled article scripts (create-article-draft.js, update-article.js).
const Test = require('../src/models/test.model');

// Same list as the admin's article form, so the admin can still edit the article's categories
const CATEGORIES = [
    'Новини', 'Поради', 'Дослідження', 'Інформація', 'Історії',
    'Депресія', 'Тривога', 'Стрес', 'Сон', 'Залежності',
    'Дитяча психологія', 'Самодопомога', 'Відносини', 'Профілактика',
];

/** Returns an error message for article.json fields that can be checked without the database, or null. */
const checkArticleInput = (data, required = ['title', 'excerpt', 'content']) => {
    for (const key of required) {
        if (!data[key]?.trim()) return `"${key}" is empty`;
    }
    // Articles send readers to the clinic, not to a named doctor, and end with the disclaimer
    if (/Скрипник/i.test(data.content)) return 'content names the doctor — point booking to the clinic instead';
    if (!data.content.includes('суто інформаційний характер')) return 'content lacks the "суто інформаційний характер" disclaimer';

    // Covers are our own banners: use the URL scripts/upload-cover.js prints (S3 or /api/covers)
    if (data.coverImage && !/^https:\/\/[a-z0-9.-]+\/(api\/)?covers\/[a-z0-9-]+\.webp$/.test(data.coverImage)) {
        return 'coverImage must be the URL printed by scripts/upload-cover.js (…/covers/<slug>.webp)';
    }

    const unknown = (data.categories ?? []).filter(c => !CATEGORIES.includes(c));
    if (unknown.length) return `unknown categories: ${unknown.join(', ')} (allowed: ${CATEGORIES.join(', ')})`;
    return null;
};

/** Test slugs → test docs; throws on a slug that doesn't exist. Needs a mongoose connection. */
const findRelatedTests = async (slugs = []) => {
    const tests = await Test.find({ slug: { $in: slugs } }, { slug: 1 }).lean();
    const missing = slugs.filter(s => !tests.some(t => t.slug === s));
    if (missing.length) throw new Error(`unknown test slugs: ${missing.join(', ')}`);
    return tests;
};

const countWords = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

module.exports = { CATEGORIES, checkArticleInput, findRelatedTests, countWords };
