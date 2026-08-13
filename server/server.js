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
app.use(cors());
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