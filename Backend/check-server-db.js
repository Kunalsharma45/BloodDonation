import mongoose from 'mongoose';
import { env } from './config/env.js';

// Connect using the SAME config as the server

await mongoose.connect(env.mongoUri);

const dbName = mongoose.connection.db.databaseName;

// Import models
const User = (await import('./modules/User.js')).default;

// Find all organizations
const orgs = await User.find({ role: 'organization' }).select('organizationName Name Email organizationType isVerified');


if (orgs.length > 0) {
    orgs.forEach(o => {
    });
} else {

    // Check all users
    const allUsers = await User.countDocuments();

    if (allUsers > 0) {
        const sample = await User.findOne().select('Name Email role');
    }
}

await mongoose.connection.close();
