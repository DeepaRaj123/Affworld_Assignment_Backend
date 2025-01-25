const mongoose = require('mongoose');

/**
 * Function to connect to the MongoDB database
 */
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using the connection URI from environment variables
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error('Database Connection Error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
