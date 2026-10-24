// Uploads an article cover (and its .jpg share twin) so it is live at once — no frontend deploy.
// Made by apps/frontend/scripts/make-article-cover.py.
//
//   node scripts/upload-cover.js <path/to/slug.webp> [more.webp ...]
//
// With S3 configured (see src/services/s3.service.js) the files go to the bucket as
// covers/<slug>-<content hash>.webp|.jpg: the hash changes when a cover is redrawn, so they can
// be cached forever. Otherwise they are stored in the database and served by /api/covers.
// Prints the URL to use as the article's coverImage.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Cover = require('../src/models/cover.model');
const { s3Config, putObject } = require('../src/services/s3.service');

const API_URL = process.env.API_URL || 'https://mental-clinic-be.onrender.com';

const readPair = (file) => {
    const slug = path.basename(file, '.webp');
    if (!file.endsWith('.webp') || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: expected <slug>.webp`);
    const jpgFile = file.replace(/\.webp$/, '.jpg');
    if (!fs.existsSync(jpgFile)) throw new Error(`${jpgFile} is missing — regenerate the cover`);
    return { slug, webp: fs.readFileSync(file), jpg: fs.readFileSync(jpgFile) };
};

async function toS3({ slug, webp, jpg }) {
    const hash = crypto.createHash('sha256').update(webp).update(jpg).digest('hex').slice(0, 8);
    await putObject(`covers/${slug}-${hash}.jpg`, jpg, 'image/jpeg');
    return putObject(`covers/${slug}-${hash}.webp`, webp, 'image/webp');
}

async function toDatabase({ slug, webp, jpg }) {
    await Cover.findOneAndUpdate({ slug }, { slug, webp, jpg }, { upsert: true, runValidators: true });
    return `${API_URL}/api/covers/${slug}.webp`;
}

async function main() {
    const files = process.argv.slice(2);
    if (!files.length) throw new Error('usage: node scripts/upload-cover.js <slug.webp> [...]');
    const pairs = files.map(readPair);

    if (s3Config()) {
        for (const pair of pairs) console.log(`Cover uploaded: ${await toS3(pair)}`);
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    try {
        for (const pair of pairs) console.log(`Cover uploaded: ${await toDatabase(pair)}`);
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => { console.error(`Error: ${err.message}`); process.exit(1); });
