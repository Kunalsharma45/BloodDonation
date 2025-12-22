import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function debugDonations() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Get ALL donations
        const all = await Donation.find({}).select('_id name stage status organizationId').lean();

        // Group by status
        const byStatus = {};
        all.forEach(d => {
            byStatus[d.status] = (byStatus[d.status] || 0) + 1;
        });

        // Group by stage
        const byStage = {};
        all.forEach(d => {
            byStage[d.stage] = (byStage[d.stage] || 0) + 1;
        });

        // Show what the API would return (status: active or completed)
        const apiResult = await Donation.find({
            status: { $in: ['active', 'completed'] }
        }).select('_id name stage status').lean();

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

debugDonations();
