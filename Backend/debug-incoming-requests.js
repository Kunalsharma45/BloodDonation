import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const debug = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        // Get models
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        // Find blood banks
        const bloodBanks = await User.find({
            Role: 'ORGANIZATION',
            organizationType: { $in: ['BANK', 'BOTH'] }
        }).select('Name Email organizationType').lean();


        for (const bank of bloodBanks) {

            // Check inventory
            const units = await BloodUnit.find({ organizationId: bank._id });

            if (units.length > 0) {
                // Group by blood group and status
                const byGroup = {};
                units.forEach(unit => {
                    const key = `${unit.bloodGroup}-${unit.status}`;
                    byGroup[key] = (byGroup[key] || 0) + 1;
                });

                Object.entries(byGroup).forEach(([key, count]) => {
                });

                // Show available units
                const available = units.filter(u => u.status === 'AVAILABLE');
                const availByGroup = {};
                available.forEach(u => {
                    availByGroup[u.bloodGroup] = (availByGroup[u.bloodGroup] || 0) + 1;
                });
                Object.entries(availByGroup).forEach(([group, count]) => {
                });
            }
        }

        // Check requests
        const requests = await Request.find({ status: 'OPEN' });

        for (const req of requests) {
        }

        // Test the aggregation query
        for (const bank of bloodBanks) {
            const inventoryCounts = await BloodUnit.aggregate([
                { $match: { organizationId: bank._id, status: "AVAILABLE" } },
                { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
            ]);

            inventoryCounts.forEach(item => {
            });

            const groupCountMap = {};
            inventoryCounts.forEach(item => {
                groupCountMap[item._id] = item.count;
            });

        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

debug();
