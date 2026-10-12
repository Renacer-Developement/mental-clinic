const crypto = require('crypto');
const Feedback = require('../models/feedback.model');
const { applyStatus } = require('./feedback.controller');
const { SPECIALISTS, STATUS_ACTIONS, botFor, render, keyboard, answerCallbackQuery } = require('../services/feedback-telegram.service');
const { editTelegramMessage } = require('../services/telegram.service');

const TOASTS = { done: 'Заявку закрито', in_progress: 'Взято в роботу', spam: 'Позначено як спам' };

const secretMatches = (header) => {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!secret || typeof header !== 'string' || header.length !== secret.length) return false;
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(secret));
};

const telegramName = (from) =>
    `${[from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || 'Telegram'} (Telegram)`;

/**
 * POST /api/telegram/webhook/:specialist — buttons under feedback notifications.
 * Registered per bot with setWebhook (secret_token = TELEGRAM_WEBHOOK_SECRET). Telegram
 * retries anything but a 2xx, so handled-but-rejected updates still answer 200.
 */
class TelegramWebhookController {
    async handle(req, res) {
        if (!secretMatches(req.get('X-Telegram-Bot-Api-Secret-Token'))) return res.sendStatus(401);

        const specialist = req.params.specialist;
        const query = req.body?.callback_query;
        if (!SPECIALISTS[specialist] || !query?.data) return res.sendStatus(200);

        const bot = botFor(specialist);
        const reply = (text) => answerCallbackQuery(bot.token, query.id, text).catch(() => {});

        try {
            const [prefix, id, status] = query.data.split(':');
            const chatId = String(query.message?.chat?.id ?? '');
            // Only the chat this bot posts requests to may change them
            if (prefix !== 'fb' || !STATUS_ACTIONS.includes(status) || chatId !== String(bot.chatId)) {
                await reply('Немає доступу');
                return res.sendStatus(200);
            }

            const feedback = /^[0-9a-f]{24}$/i.test(id) ? await Feedback.findById(id) : null;
            if (!feedback || feedback.specialist !== specialist) {
                await reply('Заявку не знайдено');
                return res.sendStatus(200);
            }

            if (feedback.status !== status) {
                applyStatus(feedback, status, { id: undefined, name: telegramName(query.from) });
                await feedback.save();
            }
            await editTelegramMessage(bot.token, chatId, query.message.message_id, render(feedback), keyboard(feedback))
                .catch(err => { if (!/not modified/i.test(err.message)) throw err; });
            await reply(TOASTS[status]);
        } catch (err) {
            console.error('Telegram webhook failed:', err.message);
            await reply('Помилка, спробуйте ще раз');
        }
        res.sendStatus(200);
    }
}

module.exports = new TelegramWebhookController();
