// routes/index.js
const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth_controller');

// Use the imported route files
router.use('/', authRoutes);

module.exports = router;
