import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const fullDiagnosis = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));


        // 1. Find all users
        const allUsers = await User.find({}).select('Name Email Role organizationType _id').lean();
        allUsers.forEach((u, idx) => {
        });

        // 2. Find A+ OPEN requests

        const aplusOpen = await Request.find({ bloodGroup: 'A+', status: 'OPEN' }).lean();

        if (aplusOpen.length === 0) {
            const allReqs = await Request.find({}).lean();
            allReqs.forEach(r => {
            });
        } else {
            aplusOpen.forEach((req, idx) => {

                const creator = allUsers.find(u =>
                    u._id.toString() === (req.createdBy?.toString() || req.organizationId?.toString())
                );
            });
        }

        // 3. Find blood bank and their inventory

        const bloodBanks = allUsers.filter(u =>
            u.organizationType === 'BANK' || u.organizationType === 'BOTH' ||
            u.Role === 'bloodbank'
        );


        for (const bank of bloodBanks) {

            // Get inventory
            const inventory = await BloodUnit.find({
                organizationId: bank._id,
                status: 'AVAILABLE'
            }).lean();


            const byGroup = {};
            inventory.forEach(u => {
                byGroup[u.bloodGroup] = (byGroup[u.bloodGroup] || 0) + 1;
            });

            if (Object.keys(byGroup).length > 0) {
                Object.entries(byGroup).forEach(([group, count]) => {
                });
            } else {
            }

            // Check what they should see

            if (aplusOpen.length > 0) {
                const req = aplusOpen[0];
                const creatorId = (req.createdBy || req.organizationId)?.toString();
                const isOwnRequest = creatorId === bank._id.toString();
            }

        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

fullDiagnosis();
