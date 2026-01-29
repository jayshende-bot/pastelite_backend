import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import pasteRoutes from './routes/pasteRoutes.js';
import createPasteLimiter from '../rateLimiter.js';
import { renderPaste } from './controllers/pasteController.js';
import { globalErrorHandler } from '../errorController.js';

// 🔥 CONNECT DB FIRST
connectDB();

const app = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (e.g. Vercel)
app.set('trust proxy', 1);

// Favicon handler to prevent log spam
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.get('/favicon.png', (req, res) => res.sendStatus(204));

// --- Middleware Configuration ---

// 1. Set security-related HTTP headers
app.use(helmet());

// 2. CORS Configuration for Production
const allowedOrigins = [
    process.env.FRONTEND_URL, // Your Vercel frontend URL from .env
    'https://pastelite-frontend-xi.vercel.app' // Hardcode as a fallback
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push('http://localhost:3000'); // For local development
}

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like Postman) or from whitelisted domains
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle pre-flight requests for all routes

// 3. Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' })); // Limit request body size for security

// Routes
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

// Apply rate limiting to the paste routes
app.use('/pastes', createPasteLimiter, pasteRoutes);
app.get('/p/:id', renderPaste);

// Global Error Handling Middleware (must be the last middleware)
app.use(globalErrorHandler);

export default app;