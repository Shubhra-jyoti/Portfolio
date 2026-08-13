const express = require('express');
const router = express.Router();
const { getStats, saveStat, deleteStat } = require('../controllers/stats.controller');
const verifyToken = require('../middleware/auth.middleware');

// Public route for HomePage
router.get('/', getStats);

// Secured Admin routes
router.post('/save', verifyToken, saveStat);
router.delete('/:semester', verifyToken, deleteStat);

module.exports = router;