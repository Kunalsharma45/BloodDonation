import mongoose from 'mongoose';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const inspectData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected.");

        // 1. List Indexes
        console.log("--- Indexes ---");
        const indexes = await Request.collection.getIndexes();
        console.log(JSON.stringify(indexes, null, 2));

        // 2. Show all requests fields related to location
        console.log("--- Data Samples ---");
        const requests = await Request.find({}).lean();
        requests.forEach((r, i) => {
            console.log(`[${i}] Status: ${r.status}, Loc: ${JSON.stringify(r.locationGeo)}`);
        });

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

inspectData();
