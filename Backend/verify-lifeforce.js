import mongoose from 'mongoose';
import User from './modules/User.js';
import BloodUnit from './modules/BloodUnit.js';
import Request from './modules/Request.js';
import Donation from './modules/Donation.js';

await mongoose.connect('mongodb://localhost:27017/Lifeforce');


// Users
const users = await User.find({}).select('Name Email role organizationType').lean();
users.forEach(u => {
});

// Blood Units
const bloodUnits = await BloodUnit.countDocuments();

// Requests
const requests = await Request.countDocuments();

// Donations
const donations = await Donation.countDocuments();


await mongoose.connection.close();
