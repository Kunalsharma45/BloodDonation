import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const simpleCheck = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));

        // Count requests
        const count = await Request.countDocuments({});

        if (count === 0) {
            await mongoose.connection.close();
            return;
        }

        // Show all requests
        const requests = await Request.find({}).lean();

        for (const req of requests) {

            // Find creator
            const creator = await User.findById(req.createdBy || req.organizationId).select('Name Role organizationType').lean();
            if (creator) {
            }
        }

        // Count blood banks
        const banks = await User.countDocuments({
            organizationType: { $in: ['BANK', 'BOTH'] }
        });

        // Count AVAILABLE blood units
        const availUnits = await BloodUnit.countDocuments({ status: 'AVAILABLE' });

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

simpleCheck();
