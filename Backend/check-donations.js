import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function checkDonations() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Check all donations in ready-storage stage
        const allReadyStorage = await Donation.find({
            stage: 'ready-storage'
        }).populate('organizationId', 'organizationType organizationName Name').lean();


        if (allReadyStorage.length > 0) {
            allReadyStorage.forEach(d => {
                const orgName = d.organizationId?.organizationName || d.organizationId?.Name || 'Unknown';
                const orgType = d.organizationId?.organizationType || 'Unknown';
            });
        }

        // Also check donations with status "active" or "completed"
        const activeDonations = await Donation.find({
            status: { $in: ['active', 'completed'] }
        }).select('_id stage status name').lean();

        if (activeDonations.length > 0) {
            const stageCount = {};
            activeDonations.forEach(d => {
                stageCount[d.stage] = (stageCount[d.stage] || 0) + 1;
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDonations();
