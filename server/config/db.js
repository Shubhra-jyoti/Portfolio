const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(String(process.env.MONGO_URI));
        console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Database Error] ${error.message}`);
        // Don't call process.exit(1) on Vercel - it kills the serverless function
    }
};

module.exports = connectDB;