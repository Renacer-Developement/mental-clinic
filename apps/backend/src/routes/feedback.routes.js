const { Router } = require('express');
const feedbackController = require('../controllers/feedback.controller');
const { authenticate, requireAdmin, requireRole } = require('../middleware/auth.middleware');

const router = Router();

// Public: the site's feedback form
router.post('/', (req, res, next) => feedbackController.create(req, res, next));

// Staff: requests hold patients' contacts, so only admins and doctors see them
const staff = [authenticate, requireRole('admin', 'doctor')];
router.get('/',       ...staff, (req, res, next) => feedbackController.getAll(req, res, next));
router.patch('/:id',  ...staff, (req, res, next) => feedbackController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => feedbackController.remove(req, res, next));

module.exports = router;
