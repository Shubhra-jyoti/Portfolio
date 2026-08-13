const express = require('express');
const router = express.Router();
const { getProjects } = require('../controllers/projects.controller');

// GitHub Projects Route
router.get('/projects', getProjects);

// We will add the /stats and /admin routes here later
module.exports = router;