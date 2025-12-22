import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

// Connect and clear requests
const clearRequests = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        // Get the Request model
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        // Count before deletion
        const countBefore = await Request.countDocuments({});

        // Delete all requests
        const result = await Request.deleteMany({});


        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

clearRequests();
