const express = require('express');
const router = express.Router();
const { getOperator, saveOperator } = require('../controllers/operatorMeta.controller');
const verifyToken = require('../middleware/auth.middleware');

// Public route: Fetch data for the homepage
router.get('/', getOperator);

// SECURED route: Only the admin with a valid token can inject changes
router.post('/save', verifyToken, saveOperator);

module.exports = router;