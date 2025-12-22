import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const checkRequest = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));

        // Find all requests
        const requests = await Request.find({}).populate('createdBy').populate('organizationId').lean();

        if (requests.length === 0) {
            await mongoose.connection.close();
            return;
        }

        requests.forEach((req, idx) => {
        });

        // Find blood bank users
        const bloodBanks = await User.find({
            $or: [
                { Role: 'ORGANIZATION', organizationType: { $in: ['BANK', 'BOTH'] } },
                { Role: 'bloodbank' }
            ]
        }).lean();


        for (const bank of bloodBanks) {

            // Check inventory
            const units = await BloodUnit.find({ organizationId: bank._id, status: 'AVAILABLE' });

            const byGroup = {};
            units.forEach(u => {
                byGroup[u.bloodGroup] = (byGroup[u.bloodGroup] || 0) + 1;
            });
            Object.entries(byGroup).forEach(([group, count]) => {
            });

            // Check which requests this bank should see
            const openRequests = requests.filter(r => r.status === 'OPEN');
            openRequests.forEach(req => {
                const creatorId = req.createdBy?._id?.toString() || req.organizationId?._id?.toString();
                const isOwnRequest = creatorId === bank._id.toString();
                const hasBloodGroup = Object.keys(byGroup).includes(req.bloodGroup);
                const shouldSee = !isOwnRequest && hasBloodGroup;

            });

        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkRequest();
