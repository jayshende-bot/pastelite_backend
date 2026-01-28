require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');
const Paste = require('./models/Paste');

// The server port is determined by the PORT environment variable (from your .env file).
// If it's not set, it defaults to 3001. Your log shows it's correctly using 5000.
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pastelite';

const startServer = async () => {
    try {
        // Log the URI to help with debugging connection issues
        console.log(`Attempting to connect to MongoDB at: ${MONGO_URI}`);
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        // Log exact connection details to help locate the data
        console.log('------------------------------------------------');
        console.log(`Connected to Database: "${mongoose.connection.name}"`);
        console.log(`Connected to Host:     "${mongoose.connection.host}"`);
        console.log(`Connected to Port:     "${mongoose.connection.port}"`);
        console.log('------------------------------------------------');

        // Auto-initialize the database with a sample document so it becomes visible
        const count = await Paste.countDocuments();
        if (count === 0) {
            console.log('Database is empty. Creating a sample paste to ensure the database is created...');
            const sample = await Paste.create({
                content: 'Welcome to PasteLite! This paste ensures your database is initialized.',
                views: 0
            });
            console.log(`Database initialized! Sample paste ID: ${sample._id}`);
        } else {
            console.log(`Database connected and contains ${count} pastes.`);
        }

        // Start the server only after DB connection is established
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
        console.error('Could not connect to the database. The server will not start.');
        console.error('Ensure MongoDB is running and the MONGO_URI is configured correctly.');
        process.exit(1);
    }
};

startServer();