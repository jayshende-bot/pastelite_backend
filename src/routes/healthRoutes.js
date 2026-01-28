const express = require('express');
const router = express.Router();
const Paste = require('../models/Paste');

router.get('/', async (req, res) => {
  try {
    await Paste.findOne(); // simple DB check
    res.json({ ok: true });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
