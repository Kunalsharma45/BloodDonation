import mongoose from 'mongoose';
import User from './modules/User.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

// Find ALL users to see what exists
const allUsers = await User.find({}).select('Name Email role organizationType isVerified').limit(10);


allUsers.forEach((u, i) => {
});

// Find your blood bank specifically (you've been using this in the session)
const bloodBank = await User.findById('6946ff84e5bb59549eb37464');
if (bloodBank) {
}

await mongoose.connection.close();
