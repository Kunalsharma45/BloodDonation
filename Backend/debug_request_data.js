import mongoose from 'mongoose';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const inspectData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        // 1. List Indexes
        const indexes = await Request.collection.getIndexes();

        // 2. Show all requests fields related to location
        const requests = await Request.find({}).lean();
        requests.forEach((r, i) => {
        });

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

inspectData();
