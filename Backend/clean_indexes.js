import mongoose from 'mongoose';
import User from './modules/User.js';
import Request from './modules/Request.js';
import dotenv from 'dotenv';
dotenv.config();

const cleanIndexes = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected.");

        try {
            await User.collection.dropIndex('locationGeo_2dsphere');
            console.log("Dropped User locationGeo_2dsphere");
        } catch (e) {
            console.log("User index drop failed (might not exist):", e.message);
        }

        try {
            await Request.collection.dropIndex('locationGeo_2dsphere');
            console.log("Dropped Request locationGeo_2dsphere");
        } catch (e) {
            console.log("Request index drop failed (might not exist):", e.message);
        }

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

cleanIndexes();
