import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import User from './modules/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function hideFromPipeline() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find all donations with status "completed" in ready-storage or completed stage
        const donations = await Donation.find({
            status: 'completed',
            stage: { $in: ['completed', 'ready-storage'] }
        }).populate('organizationId', 'organizationType organizationName Name');


        if (donations.length === 0) {
            process.exit(0);
        }

        let updated = 0;

        for (const donation of donations) {
            try {
                const org = donation.organizationId;
                const orgType = org?.organizationType || 'HOSPITAL';

                if (orgType === 'BANK') {
                    await Donation.updateOne(
                        { _id: donation._id },
                        { $set: { status: 'stored' } }
                    );
                } else {
                    await Donation.updateOne(
                        { _id: donation._id },
                        { $set: { status: 'used' } }
                    );
                }
                updated++;
            } catch (err) {
                console.error(`❌ Error updating ${donation.donorName}:`, err.message);
            }
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

hideFromPipeline();
