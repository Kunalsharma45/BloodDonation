import mongoose from 'mongoose';
import User from './modules/User.js';

await mongoose.connect('mongodb://localhost:27017/Lifeforce');


// All users
const allUsers = await User.find({});

allUsers.forEach((u, i) => {
});

// Specifically check for BANK type
const banks = await User.find({ organizationType: 'BANK' });

const verifiedBanks = await User.find({ organizationType: 'BANK', isVerified: true });

await mongoose.connection.close();
