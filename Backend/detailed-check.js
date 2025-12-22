import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function detailedCheck() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Check donations in ready-storage STAGE
        const readyStorageDonations = await Donation.find({
            stage: 'ready-storage'
        }).select('donorName stage status').lean();

        if (readyStorageDonations.length > 0) {
            readyStorageDonations.forEach(d => {
            });
        }

        // Check what the API query returns
        const apiQuery = { status: { $in: ["active", "completed"] } };
        const apiResult = await Donation.find(apiQuery).select('donorName stage status').lean();

        if (apiResult.length > 0) {
            apiResult.forEach(d => {
            });
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

detailedCheck();
