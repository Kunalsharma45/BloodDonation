import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import User from './modules/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function cleanupAllCompleted() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find all donations with status "completed" (these should be hidden from pipeline)
        const donations = await Donation.find({
            status: 'completed'
        }).populate('organizationId', 'organizationType organizationName Name');


        if (donations.length === 0) {
            process.exit(0);
        }

        let hospitalCount = 0;
        let bloodBankCount = 0;
        let unknownCount = 0;

        for (const donation of donations) {
            const org = donation.organizationId;

            if (!org) {
                donation.status = 'used';
                await donation.save();
                unknownCount++;
                continue;
            }

            if (org.organizationType === 'HOSPITAL') {
                donation.status = 'used';
                donation.history.push({
                    stage: donation.stage,
                    action: 'Blood used on patient',
                    performedBy: org._id,
                    performedAt: new Date(),
                    notes: 'Cleanup: Hospital donation marked as used'
                });
                await donation.save();
                hospitalCount++;
            } else if (org.organizationType === 'BANK') {
                donation.status = 'stored';
                donation.history.push({
                    stage: donation.stage,
                    action: 'Added to inventory',
                    performedBy: org._id,
                    performedAt: new Date(),
                    notes: 'Cleanup: Blood bank donation marked as stored'
                });
                await donation.save();
                bloodBankCount++;
            } else {
                donation.status = 'used';
                await donation.save();
                unknownCount++;
            }
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanupAllCompleted();
