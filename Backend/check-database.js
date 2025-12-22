import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const checkAll = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));
        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        // Get ALL users
        const allUsers = await User.find({}).select('Name Email Role organizationType').lean();

        // Group by role
        const byRole = {};
        allUsers.forEach(u => {
            const role = u.Role || 'NO_ROLE';
            byRole[role] = (byRole[role] || 0) + 1;
        });

        Object.entries(byRole).forEach(([role, count]) => {
        });

        // Show organizations
        const orgs = allUsers.filter(u => u.Role === 'ORGANIZATION' || u.Role === 'hospital' || u.Role === 'bloodbank');
        orgs.forEach(org => {
        });

        // Check ALL blood units
        const allUnits = await BloodUnit.find({});

        if (allUnits.length > 0) {
            // Group by organization
            const byOrg = {};
            allUnits.forEach(u => {
                const orgId = u.organizationId?.toString() || 'NO_ORG';
                byOrg[orgId] = (byOrg[orgId] || 0) + 1;
            });

            for (const [orgId, count] of Object.entries(byOrg)) {
                const org = allUsers.find(u => u._id.toString() === orgId);

                const orgUnits = allUnits.filter(u => u.organizationId?.toString() === orgId);
                const byGroupStatus = {};
                orgUnits.forEach(u => {
                    const key = `${u.bloodGroup || 'UNKNOWN'} (${u.status || 'NO_STATUS'})`;
                    byGroupStatus[key] = (byGroupStatus[key] || 0) + 1;
                });

                Object.entries(byGroupStatus).forEach(([key, cnt]) => {
                });
            }
        }

        // Check requests
        const allRequests = await Request.find({});

        if (allRequests.length > 0) {
            allRequests.forEach((req, idx) => {
                const creator = allUsers.find(u => u._id.toString() === req.createdBy?.toString() || u._id.toString() === req.organizationId?.toString());
            });
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAll();
