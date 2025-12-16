import mongoose from 'mongoose';
import { env } from './config/env.js';
import User from './modules/User.js';
import Hospital from './modules/Hospital.js';
import dotenv from 'dotenv';
dotenv.config();

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected to DB");

        console.log("--- User Indexes ---");
        const userIndexes = await User.collection.getIndexes();
        console.log(JSON.stringify(userIndexes, null, 2));

        console.log("--- Hospital Indexes ---");
        const hospitalIndexes = await Hospital.collection.getIndexes();
        console.log(JSON.stringify(hospitalIndexes, null, 2));

        mongoose.disconnect();
    } catch (err) {
        console.error("Index Check Error:", err);
    }
};

checkIndexes();
