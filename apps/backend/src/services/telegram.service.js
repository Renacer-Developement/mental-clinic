/** Escapes user input for Telegram's HTML parse mode (<, > and & would break the message). */
const escapeHtml = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/** Calls a Bot API method; throws if Telegram rejects it. Returns `result`. */
const callTelegram = async (token, method, payload) => {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) {
        throw new Error(`Telegram error: ${data.description ?? JSON.stringify(data)}`);
    }
    return data.result;
};

/**
 * Sends an HTML-formatted message through a bot. Defaults to the clinic bot
 * (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID); throws if the bot isn't configured
 * or Telegram rejects the message. Returns the sent message.
 */
const sendTelegramMessage = async (
    text,
    { token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID, replyMarkup } = {},
) => {
    if (!token || !chatId) {
        throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    }
    return callTelegram(token, 'sendMessage', {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        ...(replyMarkup ? { reply_markup: replyMarkup } : {}),
    });
};

/** Sends a photo by URL (Telegram downloads it) with an optional HTML caption. */
const sendTelegramPhoto = (token, chatId, photoUrl, caption) =>
    callTelegram(token, 'sendPhoto', {
        chat_id: chatId,
        photo: photoUrl,
        ...(caption ? { caption, parse_mode: 'HTML' } : {}),
    });

/** Replaces the text and buttons of a message the bot sent earlier. */
const editTelegramMessage = (token, chatId, messageId, text, replyMarkup) =>
    callTelegram(token, 'editMessageText', {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: replyMarkup ?? { inline_keyboard: [] },
    });

/** Stops the loading spinner on a pressed button, optionally with a short toast. */
const answerCallbackQuery = (token, callbackQueryId, text) =>
    callTelegram(token, 'answerCallbackQuery', { callback_query_id: callbackQueryId, ...(text ? { text } : {}) });

module.exports = { escapeHtml, sendTelegramMessage, sendTelegramPhoto, editTelegramMessage, answerCallbackQuery };
