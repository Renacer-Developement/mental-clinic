const crypto = require('crypto');
const Article = require('../models/article.model');
const { answerCallbackQuery, editTelegramMessage } = require('../services/telegram.service');
const {
    REVIEW_ACTIONS, REFRESH_ACTIONS, reviewBot, renderSummary, reviewKeyboard, syncReviewMessages,
    renderRefreshSummary, refreshKeyboard, syncRefreshMessages,
} = require('../services/article-review-telegram.service');

const TOASTS = {
    publish: 'Опубліковано', reject: 'Відхилено', undo: 'Повернуто на перевірку',
    apply: 'Оновлення застосовано', drop: 'Оновлення відхилено',
};

const secretMatches = (header) => {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (!secret || typeof header !== 'string' || header.length !== secret.length) return false;
    return crypto.timingSafeEqual(Buffer.from(header), Buffer.from(secret));
};

const telegramName = (from) =>
    `${[from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || 'Telegram'} (Telegram)`;

/**
 * POST /api/telegram/webhook/support — the support bot (TELEGRAM_BOT_TOKEN).
 * Registered with scripts/set-support-webhook.js (secret_token = TELEGRAM_WEBHOOK_SECRET).
 * Handles the Опублікувати / Відхилити / Повернути buttons under an article draft sent
 * for review, and Застосувати / Відхилити under a proposed refresh of a published article. Telegram retries anything but a 2xx, so rejected updates still answer 200.
 */
class ArticleReviewWebhookController {
    async handle(req, res) {
        if (!secretMatches(req.get('X-Telegram-Bot-Api-Secret-Token'))) return res.sendStatus(401);
        try {
            if (req.body?.callback_query) await this.onButton(req.body.callback_query);
        } catch (err) {
            console.error('Article review webhook failed:', err.message);
        }
        res.sendStatus(200);
    }

    async onButton(query) {
        const bot = reviewBot();
        const reply = (text) => answerCallbackQuery(bot.token, query.id, text).catch(() => {});
        try {
            const [prefix, id, action] = String(query.data).split(':');
            const chatId = String(query.message?.chat?.id ?? '');
            // Only the staff chats the drafts are sent to may publish or reject them
            const known = REVIEW_ACTIONS.includes(action) || REFRESH_ACTIONS.includes(action);
            if (prefix !== 'ar' || !known || !bot.chatIds.includes(chatId)) {
                return reply('Немає доступу');
            }

            const article = /^[0-9a-f]{24}$/i.test(id) ? await Article.findById(id) : null;
            if (!article) return reply('Статтю не знайдено');
            if (REFRESH_ACTIONS.includes(action)) return await this.onRefreshButton(article, action, query, reply);
            if (article.status === 'published' && action !== 'publish') return reply('Статтю вже опубліковано');

            if (action === 'publish' && article.status !== 'published') {
                article.status = 'published';
                article.rejectedAt = undefined;
                article.rejectedByName = undefined;
            } else if (action === 'reject' && !article.rejectedAt) {
                article.rejectedAt = new Date();
                article.rejectedByName = telegramName(query.from);
            } else if (action === 'undo') {
                article.rejectedAt = undefined;
                article.rejectedByName = undefined;
            }
            await article.save();

            await editTelegramMessage(bot.token, chatId, query.message.message_id, renderSummary(article), reviewKeyboard(article))
                .catch(err => { if (!/not modified/i.test(err.message)) throw err; });
            await reply(TOASTS[action]);
            await syncReviewMessages(article, { chatId, messageId: query.message.message_id })
                .catch(err => console.error('Article review sync failed:', err.message));
        } catch (err) {
            await reply('Помилка, спробуйте ще раз');
            throw err;
        }
    }

    /** Applies or drops the rewrite waiting in `article.refreshProposal`. */
    async onRefreshButton(article, action, query, reply) {
        const p = article.refreshProposal;
        if (p?.status !== 'pending') return reply('Рішення вже ухвалено');

        if (action === 'apply') {
            article.excerpt = p.excerpt;
            article.content = p.content;
            article.categories = p.categories;
            article.tags = p.tags;
            article.relatedTests = p.relatedTests;
            if (p.coverImage) article.coverImage = p.coverImage;
            article.refreshedAt = new Date();
        }
        p.status = action === 'apply' ? 'applied' : 'rejected';
        p.decidedAt = new Date();
        p.decidedByName = telegramName(query.from);
        await article.save();

        const chatId = String(query.message.chat.id);
        await editTelegramMessage(reviewBot().token, chatId, query.message.message_id, renderRefreshSummary(article), refreshKeyboard(article))
            .catch(err => { if (!/not modified/i.test(err.message)) throw err; });
        await reply(TOASTS[action]);
        await syncRefreshMessages(article, { chatId, messageId: query.message.message_id })
            .catch(err => console.error('Article refresh sync failed:', err.message));
    }
}

module.exports = new ArticleReviewWebhookController();
