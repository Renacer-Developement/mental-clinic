const Feedback = require('../models/feedback.model');
const { escapeHtml, sendTelegramMessage } = require('../services/telegram.service');

const CONTACT_LABELS = { phone: 'Дзвінок', telegram: 'Telegram', viber: 'Viber' };
const STATUSES = ['new', 'in_progress', 'done', 'spam'];
const ADMIN_URL = process.env.ADMIN_URL || 'https://mental-clinic-admin.vercel.app';

// Per-IP limit on public submissions: 5 per 10 minutes, kept in memory (one instance).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map();
const isRateLimited = (ip) => {
    const now = Date.now();
    const hits = (recent.get(ip) || []).filter(t => now - t < WINDOW_MS);
    hits.push(now);
    recent.set(ip, hits);
    if (recent.size > 5000) recent.clear(); // never let the map grow unbounded
    return hits.length > MAX_PER_WINDOW;
};
const clientIp = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;

const notify = (f) => {
    const lines = [
        '🆕 <b>Нова заявка з сайту</b>',
        '',
        `👤 <b>Імʼя:</b> ${escapeHtml(f.name)}`,
        `📞 <b>Телефон:</b> ${escapeHtml(f.phone)}`,
        `💬 <b>Звʼязок:</b> ${CONTACT_LABELS[f.contactMethod]}`,
    ];
    if (f.message) lines.push('', `📝 ${escapeHtml(f.message)}`);
    if (f.pagePath) lines.push('', `🔗 Сторінка: ${escapeHtml(f.pagePath)}`);
    lines.push(
        `🕐 ${f.createdAt.toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`,
        '',
        `<a href="${ADMIN_URL}/requests">Відкрити в адмінці</a>`,
    );
    // A separate chat for patient requests, if set; otherwise the bot's default chat
    return sendTelegramMessage(lines.join('\n'), process.env.FEEDBACK_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID);
};

class FeedbackController {
    // Public
    async create(req, res, next) {
        try {
            const { name, phone, contactMethod, message, pagePath, website } = req.body || {};

            // Honeypot: the form hides this field from people, bots fill it in. Pretend success.
            if (website) return res.status(201).json({ ok: true });

            if (!name?.trim() || !phone?.trim()) {
                return res.status(400).json({ message: 'Вкажіть імʼя та телефон' });
            }
            const digits = phone.replace(/\D/g, '');
            if (digits.length < 9 || digits.length > 15) {
                return res.status(400).json({ message: 'Перевірте номер телефону' });
            }
            if (isRateLimited(clientIp(req))) {
                return res.status(429).json({ message: 'Забагато заявок. Спробуйте трохи пізніше або зателефонуйте нам.' });
            }

            const feedback = await Feedback.create({
                name:          String(name).trim().slice(0, 100),
                phone:         String(phone).trim().slice(0, 30),
                contactMethod: CONTACT_LABELS[contactMethod] ? contactMethod : 'phone',
                message:       String(message || '').trim().slice(0, 2000),
                pagePath:      String(pagePath || '').trim().slice(0, 300),
            });

            // The request is saved either way; a Telegram outage must not fail the form
            notify(feedback).catch(err => console.error('Feedback Telegram notification failed:', err.message));

            res.status(201).json({ ok: true });
        } catch (e) { next(e); }
    }

    // Staff: newest first, with per-status counts for the filter tabs
    async getAll(req, res, next) {
        try {
            const filter = STATUSES.includes(req.query.status) ? { status: req.query.status } : {};
            const [items, grouped] = await Promise.all([
                Feedback.find(filter).sort({ createdAt: -1 }).limit(500),
                Feedback.aggregate([{ $group: { _id: '$status', n: { $sum: 1 } } }]),
            ]);
            const counts = Object.fromEntries(STATUSES.map(s => [s, 0]));
            grouped.forEach(g => { counts[g._id] = g.n; });
            res.json({ items, counts });
        } catch (e) { next(e); }
    }

    // Staff: only status and the internal note can change
    async update(req, res, next) {
        try {
            const changes = {};
            if (req.body?.status !== undefined) {
                if (!STATUSES.includes(req.body.status)) return res.status(400).json({ message: 'Невідомий статус' });
                changes.status = req.body.status;
            }
            if (req.body?.note !== undefined) changes.note = String(req.body.note).slice(0, 2000);

            const feedback = await Feedback.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
            if (!feedback) return res.status(404).json({ message: 'Заявку не знайдено' });
            res.json(feedback);
        } catch (e) { next(e); }
    }

    async remove(req, res, next) {
        try {
            const feedback = await Feedback.findByIdAndDelete(req.params.id);
            if (!feedback) return res.status(404).json({ message: 'Заявку не знайдено' });
            res.json({ message: 'Видалено' });
        } catch (e) { next(e); }
    }
}

module.exports = new FeedbackController();
