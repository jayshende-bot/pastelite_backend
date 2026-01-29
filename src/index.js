require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../src/app');

// This file is the single entry point for Vercel's serverless environment.

// --- Database Connection ---
// Establish the database connection once when the serverless function is initialized.
// This connection can be reused for subsequent invocations.
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully for Vercel.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Export the Express App ---
// Vercel will use this exported app to handle all incoming requests as per vercel.json.
module.exports = app;