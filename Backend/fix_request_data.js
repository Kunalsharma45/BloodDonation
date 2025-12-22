import mongoose from 'mongoose';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        // 1. Update documents missing status
        const resStatus = await Request.updateMany(
            { status: { $exists: false } },
            { $set: { status: "OPEN" } }
        );

        // 2. Update documents with missing/invalid location
        // Set default to New Delhi [77.2, 28.6] if missing
        const resLoc = await Request.updateMany(
            { "locationGeo.coordinates": { $exists: false } },
            { $set: { locationGeo: { type: "Point", coordinates: [77.2, 28.6] } } }
        );

        // 3. Ensure index exists
        await Request.collection.createIndex({ locationGeo: "2dsphere" });

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

fixData();
