const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes      = require('./routes/auth.routes');
const testRoutes      = require('./routes/test.routes');
const articleRoutes   = require('./routes/article.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const teamRoutes      = require('./routes/team.routes');
const reviewRoutes    = require('./routes/review.routes');
const supportRoutes   = require('./routes/support.routes');
const contractRoutes  = require('./routes/contract.routes');
const feedbackRoutes  = require('./routes/feedback.routes');
const telegramRoutes  = require('./routes/telegram.routes');
const goRoutes        = require('./routes/go.routes');
const coverRoutes     = require('./routes/cover.routes');
const searchRoutes    = require('./routes/search.routes');
const errorHandler    = require('./middleware/error.middleware');

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

const isLocalhost = (origin) => /^https?:\/\/localhost(:\d+)?$/.test(origin);

// Any site may call the API (doctor sites, previews, Render/Vercel mirrors), but
// only trusted origins get credentials: the auth cookie is SameSite=None, so
// allowing credentials for every origin would let any page act as a logged-in admin.
const corsOptions = (req, cb) => {
    const origin = req.header('Origin');
    const trusted = !origin || isLocalhost(origin) || ALLOWED_ORIGINS.includes(origin);
    cb(null, {
        origin: true,
        credentials: trusted,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
};

const app = express();
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // explicit preflight for PATCH/DELETE
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/tests',     testRoutes);
app.use('/api/articles',  articleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/team',      teamRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/support',   supportRoutes);
app.use('/api/contract',  contractRoutes);
app.use('/api/feedback',  feedbackRoutes);
app.use('/api/telegram',  telegramRoutes);
app.use('/api/go',        goRoutes);
app.use('/api/covers',    coverRoutes);
app.use('/api/search',    searchRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use(errorHandler);

module.exports = app;
