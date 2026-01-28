const express = require('express');
const mongoose = require('mongoose');
const Paste = require('../models/Paste');
const router = express.Router();

// Route to handle /p/:id
router.get('/p/:id', async (req, res) => {
    const { id } = req.params;

    // 1. Handle Invalid Paste ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    try {
        // 2. Query the database
        const paste = await Paste.findById(id);

        // 3. Handle Paste does not exist
        if (!paste) {
            return res.status(404).json({ error: 'Paste not found' });
        }

        // 4. Return the paste data
        res.status(200).json(paste);

    } catch (error) {
        // 5. Handle MongoDB/Server errors
        console.error('Error fetching paste:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;