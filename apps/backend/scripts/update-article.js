// Refreshes a published article in place for SEO: new content, excerpt, tags, related tests,
// cover. The title (and so the slug and URL) never changes. Used by the scheduled refresh task.
//
//   node scripts/update-article.js --pick <out.json> [--min-days 60]
//       writes the published article refreshed longest ago (and not within min-days) to out.json
//   node scripts/update-article.js <article.json> [--dry-run]
//       saves it back, sets refreshedAt and sends a notice to the support bot
//
// article.json: what --pick wrote, edited, plus "changes": a short Ukrainian note on what changed.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const mongoose = require('mongoose');
const Article = require('../src/models/article.model');
const Test = require('../src/models/test.model');
const { notifyPublished } = require('../src/services/article-review-telegram.service');
const { checkArticleInput, findRelatedTests, countWords } = require('./article-input');

const DAY = 24 * 60 * 60 * 1000;
const fail = (msg) => { console.error(`Error: ${msg}`); process.exit(1); };

async function pick(outFile, minDays) {
    const articles = await Article.find({ status: 'published' }).lean();
    const lastTouched = (a) => new Date(a.refreshedAt ?? a.publishedAt ?? a.createdAt).getTime();
    const due = articles
        .filter(a => Date.now() - lastTouched(a) >= minDays * DAY)
        .sort((a, b) => lastTouched(a) - lastTouched(b));
    if (!due.length) {
        console.log(`Nothing to refresh: every published article is newer than ${minDays} days`);
        return;
    }
    const a = due[0];
    const tests = await Test.find({ _id: { $in: a.relatedTests } }, { slug: 1 }).lean();
    const out = {
        id: String(a._id),
        title: a.title,
        excerpt: a.excerpt ?? '',
        content: a.content,
        categories: a.categories ?? [],
        tags: a.tags ?? [],
        relatedTests: tests.map(t => t.slug),
        coverImage: a.coverImage ?? null,
        changes: '',
    };
    fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
    console.log(`Picked: ${a._id} "${a.title}" → /${a.slug}, published ${a.publishedAt?.toISOString().slice(0, 10)}, `
        + `refreshed ${a.refreshedAt?.toISOString().slice(0, 10) ?? 'never'}, ${a.views} views, ${countWords(a.content)} words`);
    console.log(`Written to ${outFile} (${due.length} article(s) due)`);
}

async function save(file, dryRun) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!/^[0-9a-f]{24}$/i.test(data.id ?? '')) fail('"id" is missing — start from the file --pick wrote');
    if (!data.changes?.trim()) fail('"changes" is empty — say in a sentence what was updated');
    const error = checkArticleInput(data, ['excerpt', 'content']);
    if (error) fail(error);

    const article = await Article.findById(data.id);
    if (!article) fail(`no article with id ${data.id}`);
    if (article.status !== 'published') fail(`article ${data.id} is ${article.status}, not published`);
    // A new title would change the slug and break the URL Google has indexed
    if (data.title && data.title.trim() !== article.title.trim()) fail('the title must stay the same (it sets the URL)');

    const tests = await findRelatedTests(data.relatedTests);
    const words = countWords(data.content);
    if (dryRun) {
        console.log(`Dry run OK: "${article.title}" → /${article.slug}, ${countWords(article.content)} → ${words} words, ${tests.length} related tests`);
        return;
    }

    article.excerpt = data.excerpt.trim();
    article.content = data.content;
    article.categories = data.categories ?? article.categories;
    article.tags = data.tags ?? article.tags;
    article.relatedTests = tests.map(t => t._id);
    if (data.coverImage) article.coverImage = data.coverImage;
    article.refreshedAt = new Date();
    await article.save();
    console.log(`Refreshed: ${article._id} "${article.title}" (slug ${article.slug}), ${words} words`);

    try {
        await notifyPublished(article, `🔄 Статтю оновлено: ${data.changes.trim()}`);
        console.log('Telegram: refresh notice sent');
    } catch (err) {
        console.log(`Telegram: NOT sent — ${err.message}`);
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (!args[0]) fail('usage: node scripts/update-article.js --pick <out.json> [--min-days 60] | <article.json> [--dry-run]');

    await mongoose.connect(process.env.MONGODB_URI);
    try {
        if (args[0] === '--pick') {
            if (!args[1]) fail('--pick needs an output file');
            const i = args.indexOf('--min-days');
            await pick(args[1], i > -1 ? Number(args[i + 1]) : 60);
        } else {
            await save(args[0], args.includes('--dry-run'));
        }
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => fail(err.message));
