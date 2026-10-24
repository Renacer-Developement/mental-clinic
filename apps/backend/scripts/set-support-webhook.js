// Points the support bot's webhook at the API so its article-review buttons work.
// Run once (and again if the API URL changes), with the production values in apps/backend/.env:
//
//   TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, API_URL (defaults to the Render URL)
//
//   node scripts/set-support-webhook.js
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const API_URL = process.env.API_URL || 'https://mental-clinic-be.onrender.com';

async function main() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!token || !secret) throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET must be set');

    const call = async (method, payload) => {
        const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload ?? {}),
        });
        const data = await res.json();
        if (!data.ok) throw new Error(`${method}: ${data.description}`);
        return data.result;
    };

    // A bot has one webhook; refuse to silently take over one that points somewhere else
    const current = await call('getWebhookInfo');
    const url = `${API_URL}/api/telegram/webhook/support`;
    if (current.url && current.url !== url) {
        throw new Error(`the bot already has a webhook: ${current.url}. Remove it first if that is intended.`);
    }

    await call('setWebhook', { url, secret_token: secret, allowed_updates: ['callback_query'] });
    console.log(`Webhook set: ${url}`);
}

main().catch(err => { console.error(`Error: ${err.message}`); process.exit(1); });
