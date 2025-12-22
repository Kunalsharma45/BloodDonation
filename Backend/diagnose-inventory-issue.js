import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const diagnoseIssue = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        // Find the blood bank user (logged in as "rakttdan")
        const bloodBank = await User.findOne({
            Name: { $regex: /raktt/i }
        }).lean();

        if (!bloodBank) {
            const allUsers = await User.find({}).select('Name Email Role organizationType').lean();
            allUsers.forEach(u => {
            });
            await mongoose.connection.close();
            return;
        }


        // Check blood units for this user
        const myUnits = await BloodUnit.find({ organizationId: bloodBank._id });

        if (myUnits.length === 0) {

            const allUnits = await BloodUnit.find({}).limit(10);
            for (const unit of allUnits) {
                const owner = await User.findById(unit.organizationId).select('Name').lean();
            }
        } else {
            const byGroupStatus = {};
            myUnits.forEach(u => {
                const key = `${u.bloodGroup || 'UNKNOWN'} - ${u.status || 'NO_STATUS'}`;
                byGroupStatus[key] = (byGroupStatus[key] || 0) + 1;
            });

            Object.entries(byGroupStatus).forEach(([key, count]) => {
            });

            // Count AVAILABLE units by blood group
            const availableUnits = myUnits.filter(u => u.status === 'AVAILABLE');

            const availByGroup = {};
            availableUnits.forEach(u => {
                availByGroup[u.bloodGroup] = (availByGroup[u.bloodGroup] || 0) + 1;
            });

            Object.entries(availByGroup).forEach(([group, count]) => {
            });
        }

        // Check the A+ request
        const aplusRequest = await Request.findOne({
            bloodGroup: 'A+',
            status: 'OPEN'
        }).populate('createdBy').lean();

        if (aplusRequest) {
        } else {
        }

        // Simulate the aggregation query
        const inventoryCounts = await BloodUnit.aggregate([
            { $match: { organizationId: bloodBank._id, status: "AVAILABLE" } },
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);

        if (inventoryCounts.length === 0) {
        } else {
            inventoryCounts.forEach(item => {
            });
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

diagnoseIssue();
