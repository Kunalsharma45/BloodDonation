import mongoose from 'mongoose';
import Request from './modules/Request.js';

await mongoose.connect('mongodb://localhost:27017/liforce');

const orgId = '6946ff84e5bb59549eb37464';


// Check with the NEW query (assignedTo.organizationId)
const countNew = await Request.countDocuments({
    'assignedTo.organizationId': orgId,
    status: 'FULFILLED'
});


// Check with the OLD query (organizationId) 
const countOld = await Request.countDocuments({
    organizationId: orgId,
    status: 'FULFILLED'
});


// Show ALL fulfilled requests to see their structure
const allFulfilled = await Request.find({ status: 'FULFILLED' }).sort({ updatedAt: -1 }).limit(5);

allFulfilled.forEach((r, i) => {
});

await mongoose.connection.close();
