import mongoose from 'mongoose';

// Connect directly
await mongoose.connect('mongodb://localhost:27017/liforce');


// Your correct organization ID
const correctOrgId = '6946ff84e5bb59549eb37464';

// Get blood units collection
const BloodUnit = mongoose.connection.collection('bloodunits');

// Check current state
const allUnits = await BloodUnit.find({}).toArray();

if (allUnits.length > 0) {
    // Show current org IDs
    const orgIds = {};
    allUnits.forEach(unit => {
        const id = unit.organizationId?.toString() || 'null';
        orgIds[id] = (orgIds[id] || 0) + 1;
    });

    for (const [id, count] of Object.entries(orgIds)) {
    }

    // Update all units
    const result = await BloodUnit.updateMany(
        {},
        { $set: { organizationId: new mongoose.Types.ObjectId(correctOrgId) } }
    );

} else {
}

await mongoose.connection.close();
