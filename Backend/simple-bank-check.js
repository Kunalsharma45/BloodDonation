import mongoose from 'mongoose';
import User from './modules/User.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const banks = await User.find({
    organizationType: 'BANK',
    isVerified: true
});


if (banks.length > 0) {
} else {
    // Check unverified
    const unverified = await User.find({ organizationType: 'BANK', isVerified: false });

    // Check all orgs
    const all = await User.find({ role: 'organization' }).select('organizationType isVerified organizationName');
}

await mongoose.connection.close();
