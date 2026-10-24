// Saves an article cover (and its .jpg share twin) to the database, where the API serves it
// at once — no frontend deploy needed. Made by apps/frontend/scripts/make-article-cover.py.
//
//   node scripts/upload-cover.js <path/to/slug.webp> [more.webp ...]
//
// Prints the URL to use as the article's coverImage.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Cover = require('../src/models/cover.model');

const API_URL = process.env.API_URL || 'https://mental-clinic-be.onrender.com';

async function main() {
    const files = process.argv.slice(2);
    if (!files.length) throw new Error('usage: node scripts/upload-cover.js <slug.webp> [...]');

    await mongoose.connect(process.env.MONGODB_URI);
    try {
        for (const file of files) {
            const slug = path.basename(file, '.webp');
            if (!file.endsWith('.webp') || !/^[a-z0-9-]+$/.test(slug)) throw new Error(`${file}: expected <slug>.webp`);
            const jpgFile = file.replace(/\.webp$/, '.jpg');
            if (!fs.existsSync(jpgFile)) throw new Error(`${jpgFile} is missing — regenerate the cover`);

            await Cover.findOneAndUpdate(
                { slug },
                { slug, webp: fs.readFileSync(file), jpg: fs.readFileSync(jpgFile) },
                { upsert: true, runValidators: true },
            );
            console.log(`Cover uploaded: ${API_URL}/api/covers/${slug}.webp`);
        }
    } finally {
        await mongoose.disconnect();
    }
}

main().catch(err => { console.error(`Error: ${err.message}`); process.exit(1); });
