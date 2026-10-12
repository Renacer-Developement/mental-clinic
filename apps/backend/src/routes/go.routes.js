const { Router } = require('express');

const router = Router();

// Telegram messages can't link to viber:// directly, so the "💬 Viber" button under a
// feedback request opens this URL, which hands over to the Viber app.
router.get('/viber/:digits', (req, res) => {
    const digits = req.params.digits;
    if (!/^\d{9,15}$/.test(digits)) return res.status(400).send('Invalid number');
    res.redirect(302, `viber://chat?number=%2B${digits}`);
});

module.exports = router;
