const crypto = require('crypto');
const Feedback = require('../models/feedback.model');
const { applyStatus } = require('./feedback.controller');
const {
    SPECIALISTS, STATUS_ACTIONS, MENU, LIST_LIMIT,
    botFor, isStaffChat, render, keyboard, syncMessage, answerCallbackQuery,
    menuAction, menuKeyboard, kyivDayStart, summaryLine,
} = require('../services/feedback-telegram.service');
const { sendTelegramMessage, editTelegramMessage } = require('../services/telegram.service');

const TOASTS = { done: 'Сконтактовано з клієнтом', in_progress: 'Взято в роботу', spam: 'Позначено як спам' };

const secretMatches = (header) => {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!secret || typeof header !== 'string' || header.length !== secret.length) return false;
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(secret));
};

const telegramName = (from) =>
    `${[from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || 'Telegram'} (Telegram)`;

const menuCounts = async (specialist) => {
    const [n, p, d] = await Promise.all([
        Feedback.countDocuments({ specialist, status: 'new' }),
        Feedback.countDocuments({ specialist, status: 'in_progress' }),
        Feedback.countDocuments({ specialist, status: 'done', closedAt: { $gte: kyivDayStart() } }),
    ]);
    return { new: n, in_progress: p, done_today: d };
};

/**
 * POST /api/telegram/webhook/:specialist — one webhook per specialist bot.
 * Registered with setWebhook (secret_token = TELEGRAM_WEBHOOK_SECRET). Telegram retries
 * anything but a 2xx, so handled-but-rejected updates still answer 200.
 *
 * - callback_query: the buttons under a request (Сконтактовано з клієнтом / В роботі / Спам / Повернути)
 * - message: the bot menu (/start, 🆕 Нові, 🕐 В роботі, ✅ Закриті сьогодні)
 */
class TelegramWebhookController {
    async handle(req, res) {
        if (!secretMatches(req.get('X-Telegram-Bot-Api-Secret-Token'))) return res.sendStatus(401);

        const specialist = req.params.specialist;
        if (!SPECIALISTS[specialist]) return res.sendStatus(200);
        const bot = botFor(specialist);

        try {
            if (req.body?.callback_query) await this.onButton(specialist, bot, req.body.callback_query);
            else if (req.body?.message?.text) await this.onMessage(specialist, bot, req.body.message);
        } catch (err) {
            console.error('Telegram webhook failed:', err.message);
        }
        res.sendStatus(200);
    }

    /** A status button under a request message. */
    async onButton(specialist, bot, query) {
        const reply = (text) => answerCallbackQuery(bot.token, query.id, text).catch(() => {});
        try {
            const [prefix, id, status] = query.data.split(':');
            const chatId = String(query.message?.chat?.id ?? '');
            // Only the chats this bot posts requests to may change them
            if (prefix !== 'fb' || !STATUS_ACTIONS.includes(status) || !isStaffChat(bot, chatId)) {
                return reply('Немає доступу');
            }

            const feedback = /^[0-9a-f]{24}$/i.test(id) ? await Feedback.findById(id) : null;
            if (!feedback || feedback.specialist !== specialist) return reply('Заявку не знайдено');

            if (feedback.status !== status) {
                applyStatus(feedback, status, { id: undefined, name: telegramName(query.from) });
                await feedback.save();
            }
            await editTelegramMessage(bot.token, chatId, query.message.message_id, render(feedback), keyboard(feedback))
                .catch(err => { if (!/not modified/i.test(err.message)) throw err; });
            await reply(TOASTS[status]);
            // The same request's notification in the other staff chats
            await syncMessage(feedback, { chatId, messageId: query.message.message_id })
                .catch(err => console.error('Feedback Telegram sync failed:', err.message));
        } catch (err) {
            await reply('Помилка, спробуйте ще раз');
            throw err;
        }
    }

    /** The persistent menu: lists of requests, each with its own status buttons. */
    async onMessage(specialist, bot, message) {
        const chatId = String(message.chat.id);
        const action = menuAction(message.text);
        if (!action) return;

        const send = (text, replyMarkup) => sendTelegramMessage(text, { token: bot.token, chatId, replyMarkup });
        if (!isStaffChat(bot, chatId)) {
            return send('Цей бот надсилає заявки клініки лише співробітникам.');
        }

        if (action === 'menu') {
            return send(
                `Заявки: <b>${SPECIALISTS[specialist].label}</b>\nКнопки внизу показують нові заявки, заявки в роботі й закриті сьогодні.`,
                menuKeyboard(await menuCounts(specialist)),
            );
        }

        if (action === 'done_today') {
            const closed = await Feedback.find({ specialist, status: 'done', closedAt: { $gte: kyivDayStart() } })
                .sort({ closedAt: -1 }).limit(50);
            const text = closed.length
                ? `${MENU.done_today.emoji} <b>Закриті сьогодні: ${closed.length}</b>\n\n${closed.map(summaryLine).join('\n')}`
                : 'Сьогодні ще жодної закритої заявки.';
            return send(text, menuKeyboard(await menuCounts(specialist)));
        }

        // 🆕 Нові / 🕐 В роботі: oldest first, so the longest-waiting request is on top
        const [items, total] = await Promise.all([
            Feedback.find({ specialist, status: action }).sort({ createdAt: 1 }).limit(LIST_LIMIT),
            Feedback.countDocuments({ specialist, status: action }),
        ]);
        const { emoji, label } = MENU[action];
        if (!items.length) {
            return send(`${emoji} ${label}: заявок немає.`, menuKeyboard(await menuCounts(specialist)));
        }

        // Each request is its own message so its buttons edit just that one
        for (const f of items) await send(render(f), keyboard(f));
        const more = total > items.length ? ` Показано ${items.length} найстаріших з ${total}.` : '';
        await send(`${emoji} <b>${label}: ${total}</b>.${more}`, menuKeyboard(await menuCounts(specialist)));
    }
}

module.exports = new TelegramWebhookController();
