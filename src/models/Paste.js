const mongoose = require('mongoose');

const pasteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  ttlSeconds: { type: Number, default: null },   // optional TTL in seconds
  maxViews: { type: Number, default: null },     // optional max views
  views: { type: Number, default: 0 }           // current view count
});

module.exports = mongoose.model('Paste', pasteSchema, 'pastes');
