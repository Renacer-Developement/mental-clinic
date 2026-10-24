// Saves an article as a draft (status: 'draft') so it shows up in the admin, and sends it to
// the support bot where a doctor publishes or rejects it. Used by the scheduled article task.
// Telegram needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in apps/backend/.env.
//
//   node scripts/create-article-draft.js <article.json> [--dry-run]
//   node scripts/create-article-draft.js --notify <article id>   (re-send a draft to Telegram)
//
// article.json: { title, excerpt, content (HTML), categories: [], tags: [], relatedTests: [test slugs] }
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const Article = require('../src/models/article.model');
const Test = require('../src/models/test.model');
const { ukrainianToSlug } = require('../src/utils/slug');
const { notifyDraftForReview } = require('../src/services/article-review-telegram.service');

// Same list as the admin's article form, so the admin can still edit the draft's categories
const CATEGORIES = [
    'Новини', 'Поради', 'Дослідження', 'Інформація', 'Історії',
    'Депресія', 'Тривога', 'Стрес', 'Сон', 'Залежності',
    'Дитяча психологія', 'Самодопомога', 'Відносини', 'Профілактика',
];
// Every article on the site so far is authored by this admin account under the doctor's name
const AUTHOR_ID = '6a232f2162edee7e211a89fc';
const AUTHOR_NAME = 'Євген Скрипник';

const fail = (msg) => { console.error(`Error: ${msg}`); process.exit(1); };

/**
 * Sends the draft to the support bot with Опублікувати / Відхилити buttons. A Telegram
 * failure doesn't undo the draft: it stays in the admin and can be resent with --notify.
 */
async function sendForReview(article) {
    try {
        await notifyDraftForReview(article);
        console.log(`Telegram: sent for review to ${article.tgReview.length} chat(s)`);
    } catch (err) {
        console.log(`Telegram: NOT sent — ${err.message}. Resend with: node scripts/create-article-draft.js --notify ${article._id}`);
    }
    if (article.tgReview?.length) await article.save();
}

async function main() {
    const [file, flag] = process.argv.slice(2);
    if (!file) fail('usage: node scripts/create-article-draft.js <article.json> [--dry-run] | --notify <article id>');

    // Re-send an existing draft for review (after a Telegram failure)
    if (file === '--notify') {
        await mongoose.connect(process.env.MONGODB_URI);
        try {
            const article = /^[0-9a-f]{24}$/i.test(flag ?? '') ? await Article.findById(flag) : null;
            if (!article) fail(`no article with id ${flag}`);
            if (article.status !== 'draft') fail(`article ${flag} is ${article.status}, not a draft`);
            await sendForReview(article);
        } finally {
            await mongoose.disconnect();
        }
        return;
    }
    const dryRun = flag === '--dry-run';

    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    for (const key of ['title', 'excerpt', 'content']) {
        if (!data[key]?.trim()) fail(`"${key}" is empty`);
    }
    const categories = data.categories ?? [];
    const unknown = categories.filter(c => !CATEGORIES.includes(c));
    if (unknown.length) fail(`unknown categories: ${unknown.join(', ')} (allowed: ${CATEGORIES.join(', ')})`);

    await mongoose.connect(process.env.MONGODB_URI);
    try {
        const slug = ukrainianToSlug(data.title);
        const existing = await Article.findOne({ slug }, { title: 1, status: 1 }).lean();
        if (existing) fail(`an article with this slug already exists (${existing.status}): ${existing.title}`);

        const testSlugs = data.relatedTests ?? [];
        const tests = await Test.find({ slug: { $in: testSlugs } }, { slug: 1 }).lean();
        const missing = testSlugs.filter(s => !tests.some(t => t.slug === s));
        if (missing.length) fail(`unknown test slugs: ${missing.join(', ')}`);

        const doc = {
            title: data.title.trim(),
            excerpt: data.excerpt.trim(),
            content: data.content,
            categories,
            tags: data.tags ?? [],
            relatedTests: tests.map(t => t._id),
            status: 'draft',
            author: AUTHOR_ID,
            authorName: AUTHOR_NAME,
        };

        if (dryRun) {
            const words = doc.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
            console.log(`Dry run OK: "${doc.title}" → /${slug}, ${words} words, ${tests.length} related tests`);
            return;
        }
        const saved = await Article.create(doc);
        console.log(`Draft saved: ${saved._id} "${saved.title}" (slug ${saved.slug})`);
        await sendForReview(saved);
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => fail(err.message));
