import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import User from './modules/User.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function cleanupHospitalDonations() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find all donations in ready-storage stage with status "completed"
        const donations = await Donation.find({
            stage: 'ready-storage',
            status: 'completed'
        }).populate('organizationId', 'organizationType organizationName Name');


        if (donations.length === 0) {
            process.exit(0);
        }

        let hospitalCount = 0;
        let bloodBankCount = 0;

        for (const donation of donations) {
            const org = donation.organizationId;

            if (!org) {
                continue;
            }

            if (org.organizationType === 'HOSPITAL') {
                // Mark as "used" for hospitals
                donation.status = 'used';
                donation.history.push({
                    stage: 'ready-storage',
                    action: 'Blood used on patient',
                    performedBy: org._id,
                    performedAt: new Date(),
                    notes: 'Cleanup: Marked as used (hospital - no inventory)'
                });
                await donation.save();
                hospitalCount++;
            } else if (org.organizationType === 'BANK') {
                // Mark as "stored" for blood banks
                donation.status = 'stored';
                donation.history.push({
                    stage: 'ready-storage',
                    action: 'Added to inventory',
                    performedBy: org._id,
                    performedAt: new Date(),
                    notes: 'Cleanup: Marked as stored (blood bank inventory)'
                });
                await donation.save();
                bloodBankCount++;
            }
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

cleanupHospitalDonations();
