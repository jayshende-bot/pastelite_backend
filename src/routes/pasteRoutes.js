const express = require('express');
const router = express.Router();
const { createPaste, fetchPaste } = require('../controllers/pasteController');
const createPasteLimiter = require('../rateLimiter');

// API routes
router.post('/', createPasteLimiter, createPaste);
router.get('/:id', fetchPaste);

module.exports = router;
