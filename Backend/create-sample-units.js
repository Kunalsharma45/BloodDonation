import mongoose from 'mongoose';
import BloodUnit from './modules/BloodUnit.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Create sample blood units
const sampleUnits = [
    { bloodGroup: 'A+', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'A+', component: 'WB', collectionDate: new Date('2025-01-16'), expiryDate: new Date('2025-03-16') },
    { bloodGroup: 'B+', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'B+', component: 'WB', collectionDate: new Date('2025-01-16'), expiryDate: new Date('2025-03-16') },
    { bloodGroup: 'O+', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'O+', component: 'WB', collectionDate: new Date('2025-01-17'), expiryDate: new Date('2025-03-17') },
    { bloodGroup: 'AB+', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'AB+', component: 'WB', collectionDate: new Date('2025-01-16'), expiryDate: new Date('2025-03-16') },
    { bloodGroup: 'O-', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'O-', component: 'WB', collectionDate: new Date('2025-01-17'), expiryDate: new Date('2025-03-17') },
    { bloodGroup: 'A-', component: 'WB', collectionDate: new Date('2025-01-15'), expiryDate: new Date('2025-03-15') },
    { bloodGroup: 'B-', component: 'WB', collectionDate: new Date('2025-01-16'), expiryDate: new Date('2025-03-16') },
];

const units = [];
for (let i = 0; i < sampleUnits.length; i++) {
    const unit = await BloodUnit.create({
        organizationId: new mongoose.Types.ObjectId(orgId),
        bloodGroup: sampleUnits[i].bloodGroup,
        component: sampleUnits[i].component,
        collectionDate: sampleUnits[i].collectionDate,
        expiryDate: sampleUnits[i].expiryDate,
        status: 'AVAILABLE',
        barcode: `BU-${Date.now()}-${i}`
    });
    units.push(unit);
}


// Verify
const count = await BloodUnit.countDocuments({
    organizationId: new mongoose.Types.ObjectId(orgId),
    status: 'AVAILABLE'
});


// Show distribution
const distribution = await BloodUnit.aggregate([
    { $match: { organizationId: new mongoose.Types.ObjectId(orgId), status: 'AVAILABLE' } },
    { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]);

distribution.forEach(item => {
});


await mongoose.connection.close();
