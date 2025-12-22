import mongoose from 'mongoose';
import { env } from './config/env.js';
import Hospital from './modules/Hospital.js';
import dotenv from 'dotenv';
dotenv.config();

const fixIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        try {
            await Hospital.collection.dropIndex('code_1');
        } catch (e) {
        }

        try {
            await Hospital.collection.dropIndex('email_1');
        } catch (e) {
        }

        mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
};

fixIndexes();
