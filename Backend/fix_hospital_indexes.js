import mongoose from 'mongoose';
import { env } from './config/env.js';
import Hospital from './modules/Hospital.js';
import dotenv from 'dotenv';
dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected to DB");

        try {
            await Hospital.collection.dropIndex('code_1');
            console.log("Dropped index: code_1");
        } catch (e) {
            console.log("Index code_1 not found or error:", e.message);
        }

        try {
            await Hospital.collection.dropIndex('email_1');
            console.log("Dropped index: email_1");
        } catch (e) {
            console.log("Index email_1 not found or error:", e.message);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
};

fixIndexes();
