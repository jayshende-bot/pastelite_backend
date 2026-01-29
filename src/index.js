// index.js (or your main server file)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const pasteRoutes = require('./routes/pastes'); // Uncomment if you use separate route files

const app = express();

// --- 1. CORS Configuration: The Fix ---

// Define the list of allowed origins.
// Be specific for production for security.
const allowedOrigins = [
  'https://pastelite-frontend-xi.vercel.app'
];

// For local development, you can add your local frontend URL.
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:3000'); // Example for a React dev server
}

const corsOptions = {
  origin: (origin, callback) => {
    // The 'origin' is the URL of the frontend making the request.
    // We allow requests that are in our whitelist.
    // We also allow requests with no origin (like Postman, mobile apps, or server-to-server).
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Explicitly allow headers
  credentials: true,
  optionsSuccessStatus: 204 // Respond with 204 No Content for preflight requests
};


// --- 2. Middleware Ordering: This is Critical ---

// First, apply the CORS middleware to all incoming requests.
app.use(cors(corsOptions));

// Second, create a global OPTIONS handler. This is the key for Vercel.
// It will catch all preflight requests and respond with the CORS headers.
app.options('*', cors(corsOptions));

// Third, apply body parsers AFTER CORS.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- 3. Your API Routes ---
// Define your routes AFTER all the global middleware.

// A simple test route
app.get('/', (req, res) => {
  res.status(200).send('PasteLite Backend is running!');
});

// Your actual API route
app.post('/pastes', (req, res) => {
    console.log('POST /pastes request received with body:', req.body);
    // ... your logic to save the paste to MongoDB ...
    res.status(201).json({ message: 'Paste created successfully!', data: req.body });
});

// If you use a router file:
// app.use('/pastes', pasteRoutes);


// --- 4. Vercel Export ---
// DO NOT use app.listen(). Vercel handles this.
// Export the Express app instance.
module.exports = app;
