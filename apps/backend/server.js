require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');
const searchService = require('./src/services/search.service');

const PORT = process.env.PORT || 10000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
        // Keep the site search in step with new articles and tests. Hash-based, so
        // runs with no content changes make no embedding calls.
        const reindex = () => searchService.reindex()
            .then(r => console.log('search index:', r))
            .catch(err => console.error('search reindex failed:', err.message));
        reindex();
        setInterval(reindex, 60 * 60 * 1000).unref();
    })
    .catch(err => {
        console.error('Failed to start:', err.message);
        process.exit(1);
    });
