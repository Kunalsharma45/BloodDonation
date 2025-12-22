import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BloodUnit from './modules/BloodUnit.js';
import Request from './modules/Request.js';
import User from './modules/User.js';

dotenv.config();

async function quickCheck() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce');

        // Count blood banks
        const bloodBankCount = await User.countDocuments({
            Role: 'ORGANIZATION',
            organizationType: { $in: ['BANK', 'BOTH'] }
        });

        // Count hospitals
        const hospitalCount = await User.countDocuments({
            Role: 'ORGANIZATION',
            organizationType: { $in: ['HOSPITAL', 'BOTH'] }
        });

        // Count available inventory
        const inventoryCount = await BloodUnit.countDocuments({ status: 'AVAILABLE' });

        // Count OPEN requests
        const openRequestsCount = await Request.countDocuments({ status: 'OPEN' });


        if (bloodBankCount === 0) {
        }

        if (inventoryCount === 0) {
        }

        if (openRequestsCount === 0) {
        }

        if (hospitalCount === 0) {
        }

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

quickCheck();
