import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BloodUnit from './modules/BloodUnit.js';
import Request from './modules/Request.js';
import User from './modules/User.js';
import { REQUEST_STATUS } from './config/constants.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function debugIncomingRequests() {
    try {
        await mongoose.connect(MONGODB_URI);

        // 1. Find all blood banks
        const bloodBanks = await User.find({
            Role: 'ORGANIZATION',
            organizationType: { $in: ['BANK', 'BOTH'] }
        }).select('_id Name organizationName organizationType City').lean();

        bloodBanks.forEach(bb => {
        });

        if (bloodBanks.length === 0) {
            return;
        }

        const testBloodBank = bloodBanks[0];

        // 2. Check blood bank's inventory
        const inventory = await BloodUnit.find({
            organizationId: testBloodBank._id,
            status: 'AVAILABLE'
        }).select('bloodGroup component status').lean();


        const inventoryCounts = {};
        inventory.forEach(unit => {
            inventoryCounts[unit.bloodGroup] = (inventoryCounts[unit.bloodGroup] || 0) + 1;
        });

        Object.entries(inventoryCounts).forEach(([group, count]) => {
        });

        const availableGroups = Object.keys(inventoryCounts);

        if (availableGroups.length === 0) {
            return;
        }

        // 3. Check OPEN requests
        const allOpenRequests = await Request.find({
            status: REQUEST_STATUS.OPEN
        }).populate('createdBy', 'Name organizationName organizationType').lean();

        allOpenRequests.forEach((req, idx) => {
        });

        // 4. Check matching requests
        const matchingRequests = await Request.find({
            bloodGroup: { $in: availableGroups },
            status: REQUEST_STATUS.OPEN,
            createdBy: { $ne: testBloodBank._id }
        }).populate('createdBy', 'Name organizationName').lean();


        if (matchingRequests.length === 0) {

            // Check if blood bank created requests
            const ownRequests = await Request.find({
                createdBy: testBloodBank._id,
                status: REQUEST_STATUS.OPEN
            }).lean();

            if (ownRequests.length > 0) {
            }
        } else {
            matchingRequests.forEach((req, idx) => {
                const availableUnits = inventoryCounts[req.bloodGroup] || 0;
                const canFulfill = availableUnits >= req.unitsNeeded;

            });
        }

        // 5. Summary

        if (matchingRequests.length === 0) {
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
    }
}

debugIncomingRequests();
