import mongoose from 'mongoose';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const fixData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected.");

        // 1. Update documents missing status
        const resStatus = await Request.updateMany(
            { status: { $exists: false } },
            { $set: { status: "OPEN" } }
        );
        console.log(`Updated ${resStatus.modifiedCount} requests with missing status.`);

        // 2. Update documents with missing/invalid location
        // Set default to New Delhi [77.2, 28.6] if missing
        const resLoc = await Request.updateMany(
            { "locationGeo.coordinates": { $exists: false } },
            { $set: { locationGeo: { type: "Point", coordinates: [77.2, 28.6] } } }
        );
        console.log(`Updated ${resLoc.modifiedCount} requests with missing location.`);

        // 3. Ensure index exists
        await Request.collection.createIndex({ locationGeo: "2dsphere" });
        console.log("Ensured 2dsphere index on locationGeo.");

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

fixData();
