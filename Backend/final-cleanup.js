import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import User from './modules/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function finalCleanup() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find donations in completed or ready-storage stage with status "active"
        const donations = await Donation.find({
            stage: { $in: ['completed', 'ready-storage'] },
            status: 'active'
        }).populate('organizationId', 'organizationType organizationName Name');


        if (donations.length === 0) {
            process.exit(0);
        }

        let updated = 0;

        for (const donation of donations) {
            try {
                const org = donation.organizationId;
                const orgType = org?.organizationType || 'UNKNOWN';
                const orgName = org?.organizationName || org?.Name || 'Unknown';

                // Just update the status field - don't add to history to avoid validation issues
                if (orgType === 'HOSPITAL' || orgType === 'UNKNOWN') {
                    await Donation.updateOne(
                        { _id: donation._id },
                        { $set: { status: 'used' } }
                    );
                    updated++;
                } else if (orgType === 'BANK') {
                    await Donation.updateOne(
                        { _id: donation._id },
                        { $set: { status: 'stored' } }
                    );
                    updated++;
                }
            } catch (err) {
                console.error(`❌ Error updating ${donation.name}:`, err.message);
            }
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

finalCleanup();
