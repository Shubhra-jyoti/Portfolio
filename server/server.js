const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Only load dotenv locally — Vercel injects env vars automatically
if (process.env.NODE_ENV !== 'production') {
    try {
        require('dotenv').config({ path: '../.env' });
    } catch (e) {
        console.log('[Dotenv] Could not load .env file, using system env vars.');
    }
}

const apiRoutes = require('./routes/api.routes');
const projectMetaRoutes = require('./routes/projectMeta.routes');
const operatorMetaRoutes = require('./routes/operatorMeta.routes');
const statsRoutes = require('./routes/stats.routes');
const authRoutes = require('./routes/auth.routes');

const app = express();

// CORS Middleware
app.use(cors({
    origin: true, // Reflect the request origin — allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight OPTIONS requests
app.options('{*path}', cors());

app.use(express.json());

// Lazy DB connection — connect on first request, not at startup
let isConnected = false;
app.use(async (req, res, next) => {
    if (!isConnected) {
        try {
            await connectDB();
            isConnected = true;
        } catch (err) {
            console.error('[DB Middleware] Connection failed:', err.message);
        }
    }
    next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/projects/meta', projectMetaRoutes);
app.use('/api/operator', operatorMetaRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/status', (req, res) => {
    res.json({ message: "Cinematic Server is live.", status: "Active" });
});

// Local Development Fallback
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
}

// Vercel Serverless Export
module.exports = app;