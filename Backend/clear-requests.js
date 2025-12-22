import mongoose from 'mongoose';
import { env } from './config/env.js';

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Clear all blood requests
const clearAllRequests = async () => {
    try {
        await connectDB();

        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        const result = await Request.deleteMany({});


        process.exit(0);
    } catch (error) {
        console.error('❌ Error clearing requests:', error);
        process.exit(1);
    }
};

clearAllRequests();
