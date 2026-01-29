const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const pasteRoutes = require('./routes/pasteRoutes');
const { renderPaste } = require('./controllers/pasteController');

const app = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (e.g. Vercel)
app.set('trust proxy', 1);

// Configure and enable CORS
app.use(cors({
    // This setting is flexible for Vercel. It allows requests from your deployed frontend,
    // Vercel preview URLs, and localhost by reflecting the request's 'Origin' header.
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
}));

// Set security-related HTTP headers
app.use(helmet());

// Enable JSON body parsing
app.use(express.json());

// Routes
// Handler for browser favicon requests.
// This prevents 404 errors in the logs for a missing favicon by sending a "No Content" response.
app.get('/favicon.ico', (req, res) => res.status(204).send());
app.get('/favicon.png', (req, res) => res.status(204).send());

app.get('/', (req, res) => {
    res.status(200).json({
        message: "Backend working 🚀"
    });
});
app.get('/api/healthz', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});
app.use('/api/pastes', pasteRoutes);
app.use('/pastes', pasteRoutes);
app.get('/p/:id', renderPaste);

// 404 Handler for unknown API routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'API route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
    res.status(status).json({ error: message });
});


module.exports = app;