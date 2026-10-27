const { escapeHtml, sendTelegramMessage, sendTelegramPhoto, editTelegramMessage } = require('./telegram.service');

// Review of auto-written article drafts in the support bot (TELEGRAM_BOT_TOKEN): the article
// text, then a summary message whose buttons publish or reject the draft.

const ADMIN_URL = process.env.ADMIN_URL || 'https://mental-clinic-admin.vercel.app';
const SITE_URL = 'https://doctor-skripnik.com.ua';
const REVIEW_ACTIONS = ['publish', 'reject', 'undo'];
// Telegram caps a message at 4096 characters; leave room for the "(1/3)" header
const CHUNK_MAX = 3800;

/** TELEGRAM_CHAT_ID may list several chats, comma-separated: each gets the draft and may use the buttons. */
const reviewBot = () => ({
    token: process.env.TELEGRAM_BOT_TOKEN,
    chatIds: String(process.env.TELEGRAM_CHAT_ID || '').split(',').map(s => s.trim()).filter(Boolean),
});

const decodeEntities = (s) => s
    .replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&rsquo;|&apos;/g, '’')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

/**
 * Article HTML → Telegram HTML (which only knows <b>, <i>, <a> and a few more):
 * headings become bold lines, list items bullets, tables "cell — cell" rows.
 */
const toTelegramHtml = (html) => {
    const keep = [];
    const stash = (s) => `\u0000${keep.push(s) - 1}\u0000`;
    let s = html
        .replace(/\r?\n/g, ' ')
        .replace(/<a\s[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_, href, text) =>
            stash(`<a href="${escapeHtml(href)}">`) + text + stash('</a>'))
        .replace(/<(strong|b)>/gi, () => stash('<b>')).replace(/<\/(strong|b)>/gi, () => stash('</b>'))
        .replace(/<(em|i)>/gi, () => stash('<i>')).replace(/<\/(em|i)>/gi, () => stash('</i>'))
        .replace(/<h[1-6][^>]*>/gi, () => '\n\n' + stash('<b>')).replace(/<\/h[1-6]>/gi, () => stash('</b>') + '\n')
        .replace(/<li[^>]*>/gi, '\n• ')
        .replace(/<\/t[hd]>\s*<t[hd][^>]*>/gi, ' — ')
        .replace(/<tr[^>]*>/gi, '\n')
        .replace(/<\/(p|ul|ol|table)>/gi, '\n\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '');
    s = escapeHtml(decodeEntities(s))
        .replace(/\u0000(\d+)\u0000/g, (_, i) => keep[i])
        .replace(/[ \t]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .replace(/\n{3,}/g, '\n\n');
    return s.trim();
};

/** Splits on paragraph breaks so no message exceeds Telegram's limit or cuts a tag in half. */
const chunk = (text) => {
    const parts = [];
    let current = '';
    for (const para of text.split('\n\n')) {
        const next = current ? `${current}\n\n${para}` : para;
        if (next.length > CHUNK_MAX && current) { parts.push(current); current = para; }
        else current = next;
    }
    if (current) parts.push(current);
    return parts;
};

const kyivTime = (d) => new Date(d).toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
});

const statusLine = (a) => {
    if (a.status === 'published') {
        return `✅ <b>Опубліковано</b>${a.publishedAt ? ` · ${kyivTime(a.publishedAt)}` : ''}\n${SITE_URL}/articles/${a.slug}`;
    }
    if (a.rejectedAt) {
        return `🚫 <b>Відхилено</b>${a.rejectedByName ? `: ${escapeHtml(a.rejectedByName)}` : ''} · ${kyivTime(a.rejectedAt)}`;
    }
    return '📝 <b>Чернетка — чекає на перевірку</b>';
};

const renderSummary = (a) => {
    const words = (a.content || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return [
        `📰 <b>${escapeHtml(a.title)}</b>`,
        '',
        escapeHtml(a.excerpt || ''),
        '',
        `🏷 ${escapeHtml((a.categories || []).join(', '))}${a.tags?.length ? ` · ${escapeHtml(a.tags.join(', '))}` : ''}`,
        `📏 ${words} слів · ~${a.readTime || Math.max(1, Math.ceil(words / 200))} хв читання`,
        '',
        statusLine(a),
        '',
        // Drafts open by direct link (noindex), so the doctor can see the page before publishing
        ...(a.status === 'published' ? [] : [`👁 <a href="${SITE_URL}/articles/${a.slug}">Переглянути на сайті</a>`]),
        `✏️ <a href="${ADMIN_URL}/articles/${a._id}/edit">Редагувати в адмінці</a>`,
    ].join('\n');
};

// callback_data is limited to 64 bytes: "ar:<24-char id>:<action>" fits
const button = (a, action, text) => ({ text, callback_data: `ar:${a._id}:${action}` });
const reviewKeyboard = (a) => {
    if (a.status === 'published') return { inline_keyboard: [] };
    if (a.rejectedAt) return { inline_keyboard: [[button(a, 'undo', '↩️ Повернути на перевірку')]] };
    return { inline_keyboard: [[button(a, 'publish', '✅ Опублікувати'), button(a, 'reject', '🚫 Відхилити')]] };
};

/**
 * Sends the draft for review to every staff chat: the cover, the article text (split into
 * parts), then the summary with buttons and preview/admin links. Stores the summary messages on `article.tgReview` (saved by the caller).
 */
const notifyDraftForReview = async (article) => {
    const bot = reviewBot();
    if (!bot.token || !bot.chatIds.length) throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');

    const parts = chunk(`<b>${escapeHtml(article.title)}</b>\n\n${toTelegramHtml(article.content)}`);
    const results = await Promise.allSettled(bot.chatIds.map(async (chatId) => {
        // The banner first; a missing image (not deployed yet) shouldn't stop the review
        if (article.coverImage) {
            await sendTelegramPhoto(bot.token, chatId, article.coverImage)
                .catch(err => console.log(`Telegram: cover not sent — ${err.message}`));
        }
        for (const [i, part] of parts.entries()) {
            const header = parts.length > 1 ? `<i>Нова стаття на перевірку (${i + 1}/${parts.length})</i>\n\n` : '';
            await sendTelegramMessage(header + part, { token: bot.token, chatId });
        }
        return sendTelegramMessage(renderSummary(article), { token: bot.token, chatId, replyMarkup: reviewKeyboard(article) });
    }));

    article.tgReview = results
        .filter(r => r.status === 'fulfilled')
        .map(r => ({ chatId: String(r.value.chat.id), messageId: r.value.message_id }));
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) throw new Error(`${failed.length}/${results.length} chats: ${failed[0].reason.message}`);
};

/**
 * Tells every staff chat that an article went live without review (auto-published or
 * refreshed): the cover and the summary with the site and admin links, no buttons.
 */
const notifyPublished = async (article, heading = '🤖 Опубліковано автоматично') => {
    const bot = reviewBot();
    if (!bot.token || !bot.chatIds.length) throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');

    const text = `<i>${escapeHtml(heading)}</i>\n\n${renderSummary(article)}`;
    const results = await Promise.allSettled(bot.chatIds.map(async (chatId) => {
        if (article.coverImage) {
            await sendTelegramPhoto(bot.token, chatId, article.coverImage)
                .catch(err => console.log(`Telegram: cover not sent — ${err.message}`));
        }
        return sendTelegramMessage(text, { token: bot.token, chatId });
    }));
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) throw new Error(`${failed.length}/${results.length} chats: ${failed[0].reason.message}`);
};

/** Brings every chat's summary in line with the article; `except` skips the message just edited. */
const syncReviewMessages = async (article, except) => {
    const bot = reviewBot();
    await Promise.all((article.tgReview || [])
        .filter(m => !(except && String(m.chatId) === String(except.chatId) && m.messageId === except.messageId))
        .map(m => editTelegramMessage(bot.token, m.chatId, m.messageId, renderSummary(article), reviewKeyboard(article))
            .catch(err => { if (!/not modified|not found/i.test(err.message)) throw err; })));
};

module.exports = {
    REVIEW_ACTIONS, reviewBot, toTelegramHtml, chunk, renderSummary, reviewKeyboard,
    notifyDraftForReview, notifyPublished, syncReviewMessages,
};
