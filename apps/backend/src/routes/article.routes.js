const { Router } = require('express');
const articleController = require('../controllers/article.controller');
const { authenticate, optionalAuthenticate, requireAdmin } = require('../middleware/auth.middleware');

const router = Router();

// Public
// Signed-in admins also see drafts; everyone else only published articles
router.get('/',             optionalAuthenticate, (req, res, next) => articleController.getAll(req, res, next));
router.get('/facets',       (req, res, next) => articleController.getFacets(req, res, next));
router.get('/:id/related',  (req, res, next) => articleController.getRelated(req, res, next));
router.get('/:id',          (req, res, next) => articleController.getById(req, res, next));

// Admin only
router.post('/',     authenticate, requireAdmin, (req, res, next) => articleController.create(req, res, next));
router.put('/:id',   authenticate, requireAdmin, (req, res, next) => articleController.update(req, res, next));
router.delete('/:id',authenticate, requireAdmin, (req, res, next) => articleController.delete(req, res, next));

module.exports = router;
