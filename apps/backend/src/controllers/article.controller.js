const articleService = require('../services/article.service');

class ArticleController {
    async create(req, res, next) {
        try {
            const article = await articleService.create(req.body, req.user._id);
            res.status(201).json(article);
        } catch (err) { next(err); }
    }

    async getAll(req, res, next) {
        try {
            // Drafts open by direct link for review, but never appear in public lists
            const query = req.user?.role === 'admin' ? req.query : { ...req.query, status: 'published' };
            const result = await articleService.getAll(query);
            res.status(200).json(result);
        } catch (err) { next(err); }
    }

    async getFacets(req, res, next) {
        try {
            res.set('Cache-Control', 'public, max-age=300');
            res.status(200).json(await articleService.getFacets());
        } catch (err) { next(err); }
    }

    async getById(req, res, next) {
        try {
            const article = await articleService.getById(req.params.id);
            res.status(200).json(article);
        } catch (err) { next(err); }
    }

    async getRelated(req, res, next) {
        try {
            const related = await articleService.getRelated(req.params.id);
            res.status(200).json(related);
        } catch (err) { next(err); }
    }

    async update(req, res, next) {
        try {
            const article = await articleService.update(req.params.id, req.body);
            res.status(200).json(article);
        } catch (err) { next(err); }
    }

    async delete(req, res, next) {
        try {
            await articleService.delete(req.params.id);
            res.status(200).json({ message: 'Article deleted successfully' });
        } catch (err) { next(err); }
    }
}

module.exports = new ArticleController();
