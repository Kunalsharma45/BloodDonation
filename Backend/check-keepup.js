import mongoose from 'mongoose';
import User from './modules/User.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

// Check the user you've been using
const keepup = await User.findOne({ Email: 'keepup@gmail.com' }).select('organizationName organizationType isVerified role');


if (keepup) {

    if (keepup.organizationType !== 'BANK') {
    }

    if (!keepup.isVerified) {
    }
}

await mongoose.connection.close();
