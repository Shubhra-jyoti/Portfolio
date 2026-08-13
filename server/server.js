const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config({ path: '../.env' });
const apiRoutes = require('./routes/api.routes');
const projectMetaRoutes = require('./routes/projectMeta.routes');
// Add this near your other route definitions
const operatorMetaRoutes = require('./routes/operatorMeta.routes');
const statsRoutes = require('./routes/stats.routes');





// Connect to MongoDB
connectDB();

const app = express();


// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all origins for now; tighten later
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight OPTIONS requests explicitly
app.options('*', cors());

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api/projects/meta', projectMetaRoutes);
app.use('/api/operator', operatorMetaRoutes);
app.use('/api/stats', statsRoutes);
// Basic Test Route
const authRoutes = require('./routes/auth.routes');

app.use('/api/auth', authRoutes);
app.get('/api/status', (req, res) => {
    res.json({ message: "Cinematic Server is live.", status: "Active" });
});

// Vercel Serverless Export



// Local Development Fallback
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
}
module.exports = app;