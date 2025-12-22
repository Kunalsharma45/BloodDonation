import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function checkStatus() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Check all donations by status
        const byStatus = await Donation.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        byStatus.forEach(s => {
        });

        // Check donations in ready-storage stage
        const readyStorage = await Donation.find({
            stage: 'ready-storage'
        }).select('donorName status').lean();

        if (readyStorage.length > 0) {
            readyStorage.forEach(d => {
            });
        }

        // Check what API will return
        const apiResult = await Donation.countDocuments({
            status: { $in: ['active', 'completed'] }
        });


        if (apiResult === 0) {
        } else {
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkStatus();
