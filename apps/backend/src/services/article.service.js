const articleRepository = require('../repositories/article.repository');

const notFound = () => Object.assign(new Error('Article not found'), { statusCode: 404 });

const escapeRegex = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ?sort= on the public list; anything else falls back to newest first
const SORTS = {
    newest:  { publishedAt: -1, createdAt: -1 },
    popular: { views: -1, publishedAt: -1 },
    short:   { readTime: 1, publishedAt: -1 },
};

const buildFilter = ({ status, category, tag, search } = {}) => {
    const filter = {};
    if (status)   filter.status = status;
    // Case-insensitive exact match: category URLs are lowercase, stored names are capitalised
    if (category) filter.categories = { $regex: new RegExp(`^${escapeRegex(category)}$`, 'i') };
    if (tag)      filter.tags = tag;
    if (search)   filter.$or = [
        { title:   { $regex: new RegExp(escapeRegex(search), 'i') } },
        { excerpt: { $regex: new RegExp(escapeRegex(search), 'i') } },
    ];
    return filter;
};

class ArticleService {
    create(data, authorId) {
        return articleRepository.create({ ...data, author: authorId });
    }

    getAll(query) {
        const { page, offset, limit = '10', sort, ...filterQuery } = query;
        const filter = buildFilter(filterQuery);
        const order = SORTS[sort];
        if (page || offset !== undefined) {
            return articleRepository.findAll(filter, {
                page:   parseInt(page, 10) || 1,
                // ?offset= lets "show more" continue after an uneven first batch (featured + grid)
                offset: offset !== undefined ? Math.max(parseInt(offset, 10) || 0, 0) : undefined,
                limit:  Math.min(parseInt(limit, 10) || 10, 50),
                sort:   order,
            });
        }
        return articleRepository.findAll(filter, { sort: order });
    }

    /** Published-article counts per category, for the topic filters on the site. */
    getFacets() {
        return articleRepository.categoryCounts({ status: 'published' });
    }

    async getById(idOrSlug) {
        const article = await articleRepository.findByIdOrSlug(idOrSlug);
        if (!article) throw notFound();
        articleRepository.incrementViews(article._id).catch(() => {});
        return article;
    }

    async getRelated(idOrSlug) {
        const article = await articleRepository.findByIdOrSlug(idOrSlug);
        if (!article) throw notFound();
        return articleRepository.findRelated(article._id, article.categories);
    }

    async update(id, data) {
        if (data.status === 'published') data.publishedAt = data.publishedAt || new Date();
        const article = await articleRepository.updateById(id, data);
        if (!article) throw notFound();
        return article;
    }

    async delete(id) {
        const article = await articleRepository.deleteById(id);
        if (!article) throw notFound();
    }
}

module.exports = new ArticleService();
