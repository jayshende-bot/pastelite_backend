import 'dotenv/config'; // Make sure to load environment variables
import app from './app.js';

// This file is ONLY for local development. Vercel will not use it.
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});