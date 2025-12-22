import mongoose from 'mongoose';
import User from './modules/User.js';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const cleanIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");

        try {
            await User.collection.dropIndex('locationGeo_2dsphere');
        } catch (e) {
        }

        try {
            await Request.collection.dropIndex('locationGeo_2dsphere');
        } catch (e) {
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

cleanIndexes();
