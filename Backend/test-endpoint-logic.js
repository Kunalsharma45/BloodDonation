import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const testEndpoint = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));

        // Find blood bank user (look for "raktt" in name)
        const bloodBank = await User.findOne({ Name: /raktt/i }).lean();

        if (!bloodBank) {
            await mongoose.connection.close();
            return;
        }


        // Simulate the exact backend logic
        const orgId = bloodBank._id;

        // Step 1: Get inventory counts
        const inventoryCounts = await Blood Unit.aggregate([
            { $match: { organizationId: orgId, status: "AVAILABLE" } },
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);


        const groupCountMap = {};
        const availableGroups = [];
        inventoryCounts.forEach(item => {
            groupCountMap[item._id] = item.count;
            availableGroups.push(item._id);
        });


        if (availableGroups.length === 0) {
            await mongoose.connection.close();
            return;
        }

        // Step 2: Find matching requests
        const requests = await Request.find({
            bloodGroup: { $in: availableGroups },
            status: 'OPEN',
            createdBy: { $ne: orgId }
        }).lean();


        if (requests.length === 0) {

            // Check all OPEN requests
            const allOpen = await Request.find({ status: 'OPEN' }).lean();

            allOpen.forEach(r => {
                const creatorId = r.createdBy?.toString() || 'NOT SET';
                const matchesGroup = availableGroups.includes(r.bloodGroup);
                const isOwn = creatorId === orgId.toString();

            });
        } else {
            requests.forEach(r => {
            });
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    }
};

testEndpoint();
