const express = require('express');
const router = express.Router();
const { getOverrides, saveOverride } = require('../controllers/projectMeta.controller');
const verifyToken = require('../middleware/auth.middleware');

// Public route: Fetch overrides to display on the public portfolio
router.get('/', getOverrides);

// SECURED route: Only the admin with a JWT can save changes
router.post('/save', verifyToken, saveOverride);

module.exports = router;