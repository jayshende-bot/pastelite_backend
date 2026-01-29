require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../src/app');

// This file is the single entry point for Vercel's serverless environment.

// --- Database Connection Management ---
// We cache the connection to reuse it on subsequent "warm" invocations.
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    const db = await mongoose.connect(process.env.MONGO_URI);
    cachedDb = db;
    return db;
}

// The main handler Vercel will run. It ensures the DB is connected.
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};