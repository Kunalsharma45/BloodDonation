import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BloodUnit from './modules/BloodUnit.js';
import User from './modules/User.js';

dotenv.config();

async function checkInventory() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce');

        const bloodBankId = '6946ff84e5bb59549eb37464';

        // Check if blood bank exists
        const bloodBank = await User.findById(bloodBankId).lean();

        // Check all inventory for this org (any status)
        const allInventory = await BloodUnit.find({
            organizationId: bloodBankId
        }).lean();

        allInventory.forEach((unit, idx) => {
        });

        // Check AVAILABLE inventory
        const availableInventory = await BloodUnit.find({
            organizationId: bloodBankId,
            status: 'AVAILABLE'
        }).lean();

        availableInventory.forEach((unit, idx) => {
        });

        // Try aggregate query (same as endpoint)
        const inventoryCounts = await BloodUnit.aggregate([
            {
                $match: {
                    organizationId: bloodBankId,
                    status: "AVAILABLE"
                }
            },
            {
                $group: {
                    _id: "$bloodGroup",
                    count: { $sum: 1 }
                }
            }
        ]);

        inventoryCounts.forEach(item => {
        });

        // Check if organizationId is stored as ObjectId or string
        const sampleUnit = await BloodUnit.findOne({}).lean();
        if (sampleUnit) {
        }

        // Try with ObjectId conversion
        const inventoryWithObjectId = await BloodUnit.find({
            organizationId: new mongoose.Types.ObjectId(bloodBankId),
            status: 'AVAILABLE'
        }).lean();


        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        await mongoose.connection.close();
    }
}

checkInventory();
