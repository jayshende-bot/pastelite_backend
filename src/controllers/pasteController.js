const Paste = require('../models/Paste');
const { getCurrentTime, getExpiryTime } = require('../utils/time');

// Create a paste
const createPaste = async (req, res) => {
  try {
    console.log('Incoming createPaste request:', req.body);
    const { content, ttl_seconds, max_views } = req.body;

    // Validation
    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Content is required and must be a non-empty string' });
    }

    if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
      return res.status(400).json({ error: 'ttl_seconds must be an integer ≥ 1' });
    }

    if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
      return res.status(400).json({ error: 'max_views must be an integer ≥ 1' });
    }

    const paste = new Paste({
      content: content.trim(),
      ttlSeconds: ttl_seconds || null,
      maxViews: max_views || null,
      views: 0
    });

    const savedPaste = await paste.save();
    const id = savedPaste._id.toString();


    // Return URL in /p/:id format
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/p/${id}`;

    console.log('Paste created successfully:', id);
    res.status(201).json({ id, url });
  } catch (err) {
    console.error('Error creating paste:', err);
    res.status(500).json({ error: err.message });
  }
};

// Fetch paste (API)
const fetchPaste = async (req, res) => {
  try {
    // Atomically increment views to handle concurrency
    const paste = await Paste.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!paste) return res.status(404).json({ error: 'Paste not found' });

    const now = getCurrentTime(req);
    const expiresAt = getExpiryTime(paste.createdAt, paste.ttlSeconds);

    // TTL or maxViews check
    // Note: views has already been incremented. If maxViews is 5, and views is now 6, it's exceeded.
    if ((expiresAt && now > expiresAt) || (paste.maxViews !== null && paste.views > paste.maxViews)) {
      return res.status(404).json({ error: 'Paste unavailable' });
    }

    res.json({
      content: paste.content,
      remaining_views: paste.maxViews !== null ? Math.max(0, paste.maxViews - paste.views) : null,
      expires_at: expiresAt ? expiresAt.toISOString() : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Render paste HTML
const renderPaste = async (req, res) => {
  try {
    const paste = await Paste.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!paste) return res.status(404).send('Paste not found');

    const now = getCurrentTime(req);
    const expiresAt = getExpiryTime(paste.createdAt, paste.ttlSeconds);

    if ((expiresAt && now > expiresAt) || (paste.maxViews !== null && paste.views > paste.maxViews)) {
      return res.status(404).send('Paste unavailable');
    }

    const escapeHtml = (unsafe) =>
      unsafe.replace(/[&<"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '"': '&quot;', "'": '&#039;' }[m]));

    res.send(`
      <html>
      <head><title>Paste ${paste._id}</title></head>
      <body>
        <pre>${escapeHtml(paste.content)}</pre>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

module.exports = { createPaste, fetchPaste, renderPaste };
