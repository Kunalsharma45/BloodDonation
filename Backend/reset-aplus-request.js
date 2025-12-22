import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const resetRequest = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        // Find A+ requests
        const aplusRequests = await Request.find({ bloodGroup: 'A+' });

        if (aplusRequests.length === 0) {
            await mongoose.connection.close();
            return;
        }

        for (const req of aplusRequests) {

            if (req.status === 'FULFILLED') {

                await Request.updateOne(
                    { _id: req._id },
                    {
                        $set: { status: 'OPEN' },
                        $unset: { fulfilledAt: 1, assignedTo: 1 }
                    }
                );

            } else {
            }
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

resetRequest();
