import mongoose from 'mongoose';
import Donation from './modules/Donation.js';
import Request from './modules/Request.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


const donationCount = await Donation.countDocuments({ organizationId: orgId });
const fulfilledCount = await Request.countDocuments({ organizationId: orgId, status: 'FULFILLED' });


if (donationCount === 0 && fulfilledCount === 0) {
} else {

    if (donationCount > 0) {
        const latest = await Donation.findOne({ organizationId: orgId }).sort({ createdAt: -1 });
    }

    if (fulfilledCount > 0) {
        const latest = await Request.findOne({ organizationId: orgId, status: 'FULFILLED' }).sort({ updatedAt: -1 });
    }
}

await mongoose.connection.close();
