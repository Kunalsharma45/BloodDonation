import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import Request from './modules/Request.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Check Donations
const donationCount = await Donation.countDocuments({
    organizationId: new mongoose.Types.ObjectId(orgId)
});

if (donationCount > 0) {
    const recentDonations = await Donation.find({
        organizationId: new mongoose.Types.ObjectId(orgId)
    }).limit(3).sort({ createdAt: -1 });
        id: d._id,
        createdAt: d.createdAt,
        stage: d.stage
    })));
}

// Check Fulfilled Requests
const fulfilledCount = await Request.countDocuments({
    organizationId: new mongoose.Types.ObjectId(orgId),
    status: 'FULFILLED'
});

if (fulfilledCount > 0) {
    const recentFulfilled = await Request.find({
        organizationId: new mongoose.Types.ObjectId(orgId),
        status: 'FULFILLED'
    }).limit(3).sort({ updatedAt: -1 });
        id: r._id,
        updatedAt: r.updatedAt,
        unitsNeeded: r.unitsNeeded
    })));
}


await mongoose.connection.close();
