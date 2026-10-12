const { escapeHtml, sendTelegramMessage } = require('../services/telegram.service');

class SupportController {
    async send(req, res, next) {
        try {
            const { name, message, email, phone } = req.body;
            if (!name?.trim() || !message?.trim()) {
                return res.status(400).json({ message: 'Імʼя та повідомлення обовʼязкові' });
            }

            const lines = [
                '💬 <b>Нове повідомлення підтримки</b>',
                '',
                `👤 <b>Імʼя:</b> ${escapeHtml(name.trim())}`,
            ];
            if (email?.trim()) lines.push(`✉️ <b>Email:</b> ${escapeHtml(email.trim())}`);
            if (phone?.trim()) lines.push(`📞 <b>Телефон:</b> ${escapeHtml(phone.trim())}`);
            lines.push('');
            lines.push(`📝 <b>Повідомлення:</b>`);
            lines.push(escapeHtml(message.trim()));
            lines.push('');
            lines.push(`🕐 ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`);

            await sendTelegramMessage(lines.join('\n'));

            res.status(200).json({ ok: true });
        } catch (e) { next(e); }
    }
}

module.exports = new SupportController();
