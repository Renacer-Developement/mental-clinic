/** Escapes user input for Telegram's HTML parse mode (<, > and & would break the message). */
const escapeHtml = (s) => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Sends an HTML-formatted message through a bot. Defaults to the clinic bot
 * (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID); throws if the bot isn't configured
 * or Telegram rejects the message.
 */
const sendTelegramMessage = async (
    text,
    { token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID } = {},
) => {
    if (!token || !chatId) {
        throw new Error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    const data = await res.json();
    if (!data.ok) {
        throw new Error(`Telegram error: ${data.description ?? JSON.stringify(data)}`);
    }
};

module.exports = { escapeHtml, sendTelegramMessage };
