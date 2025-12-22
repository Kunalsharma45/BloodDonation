const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/liforce');

const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false, collection: 'bloodunits' }));
const User = mongoose.model('User', new mongoose.Schema({}, { strict: false, collection: 'users' }));

async function checkBloodUnits() {
    try {

        const allUnits = await BloodUnit.find({}).limit(50).lean();

        if (allUnits.length > 0) {
            allUnits.slice(0, 5).forEach((unit, i) => {
            });

            // Group by organizationId
            const byOrg = {};
            allUnits.forEach(unit => {
                const orgId = unit.organizationId?.toString() || 'null';
                byOrg[orgId] = (byOrg[orgId] || 0) + 1;
            });

            for (const [orgId, count] of Object.entries(byOrg)) {
            }

            // Group by status
            const byStatus = {};
            allUnits.forEach(unit => {
                byStatus[unit.status] = (byStatus[unit.status] || 0) + 1;
            });

            for (const [status, count] of Object.entries(byStatus)) {
            }

            // Check organizations
            const orgs = await User.find({ role: 'ORGANIZATION' }).limit(10).lean();
            orgs.forEach((org, i) => {
            });
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkBloodUnits();
