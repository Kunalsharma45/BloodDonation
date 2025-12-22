import mongoose from 'mongoose';
import BloodUnit from './modules/BloodUnit.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Count using Mongoose model (how backend does it)
const count = await BloodUnit.countDocuments({
    organizationId: new mongoose.Types.ObjectId(orgId),
    status: "AVAILABLE"
});


// Show all units
const all = await BloodUnit.find({ organizationId: new mongoose.Types.ObjectId(orgId) }).limit(5);
all.forEach((unit, i) => {
});

// Check if there are units without this orgId
const totalUnits = await BloodUnit.countDocuments({});

// Group by organizationId
const byOrg = await BloodUnit.aggregate([
    { $group: { _id: "$organizationId", count: { $sum: 1 } } }
]);

byOrg.forEach(item => {
});

await mongoose.connection.close();
