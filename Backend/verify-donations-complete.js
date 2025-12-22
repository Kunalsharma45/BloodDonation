import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Count donations
const count = await Donation.countDocuments({ organizationId: orgId });

if (count > 0) {
    // Get all donations
    const all = await Donation.find({ organizationId: orgId }).sort({ createdAt: -1 });

    all.forEach((d, i) => {
    });

    // Simulate backend query for December 2025
    const now = new Date();
    const decStart = new Date(now.getFullYear(), 11, 1); // Month 11 = December
    const decEnd = new Date(now.getFullYear(), 11 + 1, 0, 23, 59, 59);


    const decCount = await Donation.countDocuments({
        organizationId: orgId,
        createdAt: { $gte: decStart, $lte: decEnd }
    });


    // Query for November 2025
    const novStart = new Date(now.getFullYear(), 10, 1); // Month 10 = November  
    const novEnd = new Date(now.getFullYear(), 10 + 1, 0, 23, 59, 59);


    const novCount = await Donation.countDocuments({
        organizationId: orgId,
        createdAt: { $gte: novStart, $lte: novEnd }
    });

}

await mongoose.connection.close();
