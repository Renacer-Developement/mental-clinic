const { Router } = require('express');
const telegramWebhookController = require('../controllers/telegram-webhook.controller');
const articleReviewWebhookController = require('../controllers/article-review-webhook.controller');

const router = Router();

// The support bot: Опублікувати / Відхилити under an article draft sent for review.
// Declared before /:specialist so "support" isn't taken for a specialist name.
router.post('/webhook/support', (req, res) => articleReviewWebhookController.handle(req, res));

// Telegram calls this when someone presses a button under a feedback notification
router.post('/webhook/:specialist', (req, res) => telegramWebhookController.handle(req, res));

module.exports = router;
