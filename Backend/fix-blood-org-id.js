import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

// Define schema
const bloodUnitSchema = new mongoose.Schema({}, { strict: false });
const BloodUnit = mongoose.model('BloodUnit', bloodUnitSchema, 'bloodunits');

async function fixBloodUnits() {
    try {
        await mongoose.connect(MONGODB_URI);

        // The correct organization ID from your user
        const correctOrgId = '6946ff84e5bb59549eb37464';

        const allUnits = await BloodUnit.find({});

        if (allUnits.length === 0) {
            await mongoose.connection.close();
            process.exit(0);
        }

        // Group by organizationId
        const byOrg = {};
        allUnits.forEach(unit => {
            const orgId = unit.organizationId?.toString() || 'null';
            byOrg[orgId] = (byOrg[orgId] || 0) + 1;
        });

        Object.entries(byOrg).forEach(([orgId, count]) => {
        });

        // Check if units already have correct org ID
        const unitsWithCorrectOrg = await BloodUnit.countDocuments({
            organizationId: new mongoose.Types.ObjectId(correctOrgId)
        });


        if (unitsWithCorrectOrg === allUnits.length) {
            await mongoose.connection.close();
            process.exit(0);
        }

        // Update all units to correct organization ID

        const result = await BloodUnit.updateMany(
            {},
            { $set: { organizationId: new mongoose.Types.ObjectId(correctOrgId) } }
        );


        // Verify the fix
        const verifyCount = await BloodUnit.countDocuments({
            organizationId: new mongoose.Types.ObjectId(correctOrgId)
        });

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error(error);
        await mongoose.connection.close();
        process.exit(1);
    }
}


fixBloodUnits();
