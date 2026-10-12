const { Router } = require('express');
const telegramWebhookController = require('../controllers/telegram-webhook.controller');

const router = Router();

// Telegram calls this when someone presses a button under a feedback notification
router.post('/webhook/:specialist', (req, res) => telegramWebhookController.handle(req, res));

module.exports = router;
