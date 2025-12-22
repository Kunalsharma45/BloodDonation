import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const fixUnits = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const BloodUnit = mongoose.model('BloodUnit', new mongoose.Schema({}, { strict: false }));

        // Find all ISSUED units
        const issuedUnits = await BloodUnit.find({ status: 'ISSUED' });

        if (issuedUnits.length > 0) {
            issuedUnits.forEach((unit, idx) => {
            });

            // Ask if we should change them to AVAILABLE

            const result = await BloodUnit.updateMany(
                { status: 'ISSUED' },
                { $set: { status: 'AVAILABLE' } }
            );


            // Show current status
            const nowAvailable = await BloodUnit.find({ status: 'AVAILABLE' });

            const byGroup = {};
            nowAvailable.forEach(u => {
                byGroup[u.bloodGroup] = (byGroup[u.bloodGroup] || 0) + 1;
            });

            Object.entries(byGroup).forEach(([group, count]) => {
            });
        } else {

            const allUnits = await BloodUnit.find({});
            const byStatus = {};
            allUnits.forEach(u => {
                byStatus[u.status] = (byStatus[u.status] || 0) + 1;
            });

            Object.entries(byStatus).forEach(([status, count]) => {
            });
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

fixUnits();
