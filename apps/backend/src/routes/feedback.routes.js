const { Router } = require('express');
const feedbackController = require('../controllers/feedback.controller');
const { authenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = Router();

// Public: the site's feedback form
router.post('/', (req, res, next) => feedbackController.create(req, res, next));

// Staff: requests hold patients' contacts. Admins see all; others only the
// specialists an admin granted them (User.feedbackAccess), filtered in the controller.
const hasFeedbackAccess = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.feedbackAccess?.length) return next();
    next(Object.assign(new Error('Access denied'), { statusCode: 403 }));
};
const staff = [authenticate, hasFeedbackAccess];
router.get('/',       ...staff, (req, res, next) => feedbackController.getAll(req, res, next));
router.patch('/:id',  ...staff, (req, res, next) => feedbackController.update(req, res, next));
router.delete('/:id', authenticate, requireAdmin, (req, res, next) => feedbackController.remove(req, res, next));

module.exports = router;
