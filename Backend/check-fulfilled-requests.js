import mongoose from 'mongoose';
import Request from './modules/Request.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Check with string orgId (how backend queries)
const fulfilledCount = await Request.countDocuments({
    organizationId: orgId,
    status: 'FULFILLED'
});


// Check with ObjectId (how I created sample data)
const fulfilledCountObj = await Request.countDocuments({
    organizationId: new mongoose.Types.ObjectId(orgId),
    status: 'FULFILLED'
});


// Check ALL requests for this org
const allRequests = await Request.countDocuments({
    organizationId: orgId
});


if (fulfilledCountObj > 0) {
    const requests = await Request.find({
        organizationId: new mongoose.Types.ObjectId(orgId),
        status: 'FULFILLED'
    });

    requests.forEach(r => {
    });
}

await mongoose.connection.close();
