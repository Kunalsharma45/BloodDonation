import mongoose from 'mongoose';
import { env } from './Backend/config/env.js'; // Adjust path if needed
import User from './Backend/modules/User.js';
import Hospital from './Backend/modules/Hospital.js';
import dotenv from 'dotenv';
dotenv.config({ path: './Backend/.env' });

const checkIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected to DB");

        const userIndexes = await User.collection.getIndexes();
        console.log("User Indexes:", JSON.stringify(userIndexes, null, 2));

        const hospitalIndexes = await Hospital.collection.getIndexes();
        console.log("Hospital Indexes:", JSON.stringify(hospitalIndexes, null, 2));

        mongoose.disconnect();
    } catch (err) {
        console.error("Index Check Error:", err);
    }
};

checkIndexes();
