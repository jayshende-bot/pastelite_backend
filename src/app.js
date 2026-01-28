const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const healthRoutes = require('./routes/healthRoutes');
const pasteRoutes = require('./routes/pasteRoutes');
const { renderPaste } = require('./controllers/pasteController');

const app = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (e.g. Vercel)
app.set('trust proxy', 1);

// Configure and enable CORS
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173'
        ];

        if (process.env.FRONTEND_URL) {
            allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/$/, ''));
        }

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Set security-related HTTP headers
app.use(helmet());

// Enable JSON body parsing
app.use(express.json());

// Routes
app.use('/api/healthz', healthRoutes);
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