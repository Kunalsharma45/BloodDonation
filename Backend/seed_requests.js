import mongoose from 'mongoose';
import Request from './modules/Request.js';
import User from './modules/User.js';
import dotenv from 'dotenv';
dotenv.config();

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const seedRequests = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        // Find an org user to attribute requests to
        let orgUser = await User.findOne({ Role: { $in: ["hospital", "bloodbank", "ORGANIZATION"] } });
        if (!orgUser) {
            orgUser = await User.create({
                Name: "City Hospital",
                Email: "cityhospital@example.com",
                Password: "password123",
                Role: "hospital",
                City: "New Delhi",
                PhoneNumber: "9999999999",
                locationGeo: { type: "Point", coordinates: [77.2, 28.6] }
            });
        }


        // Create one request for EACH blood group at the default location
        const requests = BLOOD_GROUPS.map(bg => ({
            createdBy: orgUser._id,
            bloodGroup: bg,
            units: Math.floor(Math.random() * 5) + 1,
            urgency: ["HIGH", "MEDIUM", "CRITICAL"][Math.floor(Math.random() * 3)],
            locationGeo: { type: "Point", coordinates: [77.2, 28.6] }, // New Delhi
            status: "OPEN",
            notes: `Urgent need for ${bg}`
        }));

        await Request.insertMany(requests);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

seedRequests();
