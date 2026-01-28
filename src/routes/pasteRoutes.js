const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { createPaste, fetchPaste } = require('../controllers/pasteController');
const createPasteLimiter = require('../rateLimiter');

// API routes
router.post('/', createPasteLimiter, createPaste);

router.get('/:id', (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }
    next();
}, fetchPaste);

module.exports = router;
