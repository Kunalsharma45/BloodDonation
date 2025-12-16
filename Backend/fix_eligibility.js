import mongoose from 'mongoose';
import User from './modules/User.js';
import dotenv from 'dotenv';
dotenv.config();

const fixEligibility = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/BloodDonation");
        console.log("Connected.");

        // Clear lastDonationDate to make everyone eligible
        // Also ensure bloodGroup is set (sample default O+)
        const res = await User.updateMany(
            {},
            {
                $unset: { lastDonationDate: "" },
                $set: { eligible: true }
            }
        );

        // Also ensure everyone has a blood group if missing
        await User.updateMany(
            { bloodGroup: { $exists: false }, Bloodgroup: { $exists: false } },
            { $set: { bloodGroup: "O+" } }
        );

        console.log(`Reset eligibility for ${res.modifiedCount} users.`);

    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

fixEligibility();
