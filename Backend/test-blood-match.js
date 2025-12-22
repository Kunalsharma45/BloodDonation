// Quick diagnostic script to check donor and requests
import mongoose from 'mongoose';
import User from './modules/User.js';
import Request from './modules/Request.js';
import { connectdb } from './config/db.js';

await connectdb();

// Find the donor
const donor = await User.findOne({ role: 'DONOR' }).lean();

//Find all requests
const requests = await Request.find({}).lean();
requests.forEach((req, i) => {
});

// Try the exact query from donor.js
const bloodGroup = donor?.bloodGroup;

const matchingRequests = await Request.find({
    status: 'OPEN',
    bloodGroup: bloodGroup
}).lean();

matchingRequests.forEach((req, i) => {
});

process.exit(0);
