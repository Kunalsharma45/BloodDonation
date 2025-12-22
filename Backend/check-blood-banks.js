import mongoose from 'mongoose';
import User from './modules/User.js';

await mongoose.connect('mongodb://localhost:27017/liforce');


// Check all organizations
const allOrgs = await User.find({
    role: 'organization'
}).select('organizationName Name organizationType isVerified City').lean();


allOrgs.forEach((org, i) => {
});

// Check specifically for blood banks
const bloodBanks = await User.find({
    organizationType: 'BANK',
    isVerified: true
}).lean();


if (bloodBanks.length === 0) {
}

await mongoose.connection.close();
