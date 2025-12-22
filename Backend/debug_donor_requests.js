import mongoose from 'mongoose';
import Request from './modules/Request.js';
import User from './modules/User.js';
import dotenv from 'dotenv';
dotenv.config();

const debugDonorRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        // 1. Check Request Count
        const count = await Request.countDocuments({});

        // 2. Check a sample request
        const sample = await Request.findOne({});

        if (!sample) {
            // Need a user ID for createdBy
            const user = await User.findOne({ Role: { $in: ["hospital", "bloodbank", "ORGANIZATION"] } });
            if (!user) {
            } else {
                await Request.create({
                    createdBy: user._id,
                    bloodGroup: "O+",
                    units: 2,
                    locationGeo: { type: "Point", coordinates: [77.2, 28.6] }, // New Delhi approx
                    status: "OPEN"
                });
            }
        }

        // 3. Simulate Query
        // Mock query params: lat=28.6, lng=77.2 (Near the sample)
        const lat = 28.6;
        const lng = 77.2;
        const km = 1000; // Large radius to be sure

        const query = {
            status: "OPEN",
            locationGeo: {
                $near: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: km * 1000,
                },
            },
        };

        const results = await Request.find(query).limit(5).lean();
        if (results.length > 0) {
        }

    } catch (err) {
        console.error("Debug Error:", err);
    } finally {
        mongoose.disconnect();
    }
};

debugDonorRequests();
