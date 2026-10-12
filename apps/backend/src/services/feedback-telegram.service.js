const { escapeHtml, sendTelegramMessage, editTelegramMessage, answerCallbackQuery } = require('./telegram.service');

// Telegram side of site feedback requests: one bot per specialist, a message per
// request whose buttons (Передзвонили / В роботі / Спам) change its status.

const SPECIALISTS = {
    doctor:       { label: 'Лікар-психіатр', env: 'DOCTOR' },
    psychologist: { label: 'Психолог',       env: 'PSYCHOLOGIST' },
};
const CONTACT_LABELS = { phone: 'Дзвінок', telegram: 'Telegram', viber: 'Viber' };
const ADMIN_URL = process.env.ADMIN_URL || 'https://mental-clinic-admin.vercel.app';
const STATUS_ACTIONS = ['done', 'in_progress', 'spam'];

/**
 * FEEDBACK_<DOCTOR|PSYCHOLOGIST>_BOT_TOKEN / _CHAT_ID, falling back to the clinic bot.
 * _CHAT_ID may list several chats, comma-separated: each gets every request and may use
 * the buttons and menu. `own` is true only for the specialist's own bot — the one whose
 * webhook handles buttons.
 */
const botFor = (specialist) => {
    const env = SPECIALISTS[specialist].env;
    const token = process.env[`FEEDBACK_${env}_BOT_TOKEN`];
    const chatIds = String(process.env[`FEEDBACK_${env}_CHAT_ID`] || process.env.TELEGRAM_CHAT_ID || '')
        .split(',').map(s => s.trim()).filter(Boolean);
    return { token: token || process.env.TELEGRAM_BOT_TOKEN, chatIds, own: !!token };
};

/** Whether a chat may use this bot's buttons and menu. */
const isStaffChat = (bot, chatId) => bot.chatIds.includes(String(chatId));

const kyivTime = (d) => new Date(d).toLocaleString('uk-UA', {
    timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
});

const statusLine = (f) => {
    if (f.status === 'done') {
        return `✅ <b>Передзвонили</b>${f.closedByName ? `: ${escapeHtml(f.closedByName)}` : ''}${f.closedAt ? ` · ${kyivTime(f.closedAt)}` : ''}`;
    }
    if (f.status === 'in_progress') return '🕐 <b>В роботі</b>';
    if (f.status === 'spam') return '🚫 <b>Спам</b>';
    return null;
};

const render = (f) => {
    const lines = [
        `🆕 <b>Нова заявка: ${SPECIALISTS[f.specialist].label}</b>`,
        '',
        `👤 <b>Імʼя:</b> ${escapeHtml(f.name)}`,
        `📞 <b>Телефон:</b> ${escapeHtml(f.phone)}`,
        `💬 <b>Звʼязок:</b> ${CONTACT_LABELS[f.contactMethod]}`,
    ];
    if (f.message) lines.push('', `📝 ${escapeHtml(f.message)}`);
    if (f.pagePath) lines.push('', `🔗 Сторінка: ${escapeHtml(f.pagePath)}`);
    lines.push(`🕐 ${f.createdAt.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`);
    const status = statusLine(f);
    if (status) lines.push('', status);
    lines.push('', `<a href="${ADMIN_URL}/requests">Відкрити в адмінці</a>`);
    return lines.join('\n');
};

// callback_data is limited to 64 bytes: "fb:<24-char id>:<status>" fits
const button = (f, status, text) => ({ text, callback_data: `fb:${f._id}:${status}` });
const keyboard = (f) => {
    if (f.status === 'done' || f.status === 'spam') {
        return { inline_keyboard: [[button(f, 'in_progress', '↩️ Повернути в роботу')]] };
    }
    const row = [button(f, 'done', '✅ Передзвонили')];
    if (f.status === 'new') row.push(button(f, 'in_progress', '🕐 В роботі'));
    row.push(button(f, 'spam', '🚫 Спам'));
    return { inline_keyboard: [row] };
};

/** Sends the new-request message and remembers it on the request (saved by the caller). */
const notifyNew = async (f) => {
    const bot = botFor(f.specialist);
    if (!bot.token || !bot.chatIds.length) throw new Error(`No Telegram bot configured for ${f.specialist}`);
    // Buttons only work through the specialist's own bot (its webhook); the fallback bot gets plain text
    const replyMarkup = bot.own ? keyboard(f) : undefined;
    const results = await Promise.allSettled(bot.chatIds.map(chatId =>
        sendTelegramMessage(render(f), { token: bot.token, chatId, replyMarkup })));

    if (bot.own) {
        f.tgMessages = results
            .filter(r => r.status === 'fulfilled')
            .map(r => ({ chatId: String(r.value.chat.id), messageId: r.value.message_id }));
    }
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length) throw new Error(`${failed.length}/${results.length} chats: ${failed[0].reason.message}`);
};

/** Every chat copy of the request's notification (older requests stored a single one). */
const messagesOf = (f) => f.tgMessages?.length
    ? f.tgMessages
    : (f.tgMessageId ? [{ chatId: f.tgChatId, messageId: f.tgMessageId }] : []);

/**
 * Brings every chat's copy of the notification in line with the request — after a status
 * change in the admin, or in another chat. `except` skips the message just edited.
 */
const syncMessage = async (f, except) => {
    const bot = botFor(f.specialist);
    if (!bot.own) return;
    await Promise.all(messagesOf(f)
        .filter(m => !(except && String(m.chatId) === String(except.chatId) && m.messageId === except.messageId))
        .map(m => editTelegramMessage(bot.token, m.chatId, m.messageId, render(f), keyboard(f))
            // "message is not modified" and deleted messages are fine to ignore
            .catch(err => { if (!/not modified|not found/i.test(err.message)) throw err; })));
};

// ── Bot menu: persistent reply keyboard with request lists ──────────────────

const MENU = {
    new:         { emoji: '🆕', label: 'Нові' },
    in_progress: { emoji: '🕐', label: 'В роботі' },
    done_today:  { emoji: '✅', label: 'Закриті сьогодні' },
};
const LIST_LIMIT = 10;

/** Which menu button a message text came from (labels carry counts, so match by emoji). */
const menuAction = (text = '') => {
    if (/^\/(start|menu)\b/.test(text)) return 'menu';
    return Object.keys(MENU).find(k => text.startsWith(MENU[k].emoji)) || null;
};

/** Reply keyboard with live counts, e.g. "🆕 Нові (3)". */
const menuKeyboard = (counts) => ({
    keyboard: [
        [{ text: `${MENU.new.emoji} ${MENU.new.label} (${counts.new})` },
         { text: `${MENU.in_progress.emoji} ${MENU.in_progress.label} (${counts.in_progress})` }],
        [{ text: `${MENU.done_today.emoji} ${MENU.done_today.label} (${counts.done_today})` }],
    ],
    resize_keyboard: true,
    is_persistent: true,
});

/** Start of today in Kyiv, as a Date: now minus the time already passed on the Kyiv clock. */
const kyivDayStart = (now = new Date()) => {
    const [h, m, s] = now.toLocaleTimeString('en-GB', { timeZone: 'Europe/Kyiv', hourCycle: 'h23' }).split(':').map(Number);
    return new Date(now.getTime() - ((h * 60 + m) * 60 + s) * 1000 - now.getMilliseconds());
};

/** One line per request for the "closed today" summary. */
const summaryLine = (f) =>
    `• ${escapeHtml(f.name)}, ${escapeHtml(f.phone)} — ${f.closedByName ? escapeHtml(f.closedByName) + ', ' : ''}${kyivTime(f.closedAt)}`;

module.exports = {
    SPECIALISTS, CONTACT_LABELS, STATUS_ACTIONS, MENU, LIST_LIMIT,
    botFor, isStaffChat, render, keyboard, notifyNew, syncMessage, answerCallbackQuery,
    menuAction, menuKeyboard, kyivDayStart, summaryLine,
};
