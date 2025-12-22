import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


const Donation = mongoose.model('Donation');
const Request = mongoose.model('Request');

const donationCount = await Donation.countDocuments({ organizationId: orgId });
const fulfilledCount = await Request.countDocuments({ organizationId: orgId, status: 'FULFILLED' });


if (donationCount > 0) {
    const sample = await Donation.findOne({ organizationId: orgId });
}

if (fulfilledCount > 0) {
    const sample = await Request.findOne({ organizationId: orgId, status: 'FULFILLED' });
}

await mongoose.connection.close();
