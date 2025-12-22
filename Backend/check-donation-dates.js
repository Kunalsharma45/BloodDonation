import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


const donations = await Donation.find({ organizationId: orgId }).sort({ createdAt: -1 });


if (donations.length > 0) {
    donations.forEach((d, i) => {
    });

    const now = new Date();
}

await mongoose.connection.close();
