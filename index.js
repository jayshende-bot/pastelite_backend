const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
    process.env.FRONTEND_URL, // Production Frontend URL
    "http://localhost:5173"   // Local Development URL
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or Postman)
        if (!origin) return callback(null, true);

        // Allow if origin is in our allowed list
        if (allowedOrigins.includes(origin)) return callback(null, true);

        // Allow Vercel preview deployments (e.g., https://your-app-git-branch.vercel.app)
        if (/\.vercel\.app$/.test(origin)) return callback(null, true);

        // Otherwise, reject
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
    res.json({ message: "Backend is running successfully on Vercel!" });
});

// Export the Express app for Vercel serverless deployment
// Do NOT use app.listen() here
module.exports = app;