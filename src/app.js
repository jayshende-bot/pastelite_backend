import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import pasteRoutes from './routes/pasteRoutes.js';
import { renderPaste } from './controllers/pasteController.js';

// 🔥 CONNECT DB FIRST
connectDB();

const app = express();

// Trust proxy is required for rate limiting to work correctly behind load balancers (e.g. Vercel)
app.set('trust proxy', 1);

// Favicon handler to prevent log spam
app.get('/favicon.ico', (req, res) => res.sendStatus(204));
app.get('/favicon.png', (req, res) => res.sendStatus(204));

// Per your instructions, middleware order is changed.
app.use(express.json());

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Set security-related HTTP headers
app.use(helmet());

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

app.use('/api/pastes', pasteRoutes);
app.use('/pastes', pasteRoutes);
app.get('/p/:id', renderPaste);

export default app;