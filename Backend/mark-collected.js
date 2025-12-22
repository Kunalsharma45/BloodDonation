import mongoose from 'mongoose';
import Appointment from './modules/Appointment.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function markAsCollected() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find appointments that are COMPLETED but not COLLECTED
        const appointments = await Appointment.find({
            status: { $in: ['COMPLETED', 'UPCOMING', 'CONFIRMED'] }
        }).populate('donorId', 'Name').lean();


        if (appointments.length === 0) {
            process.exit(0);
        }

        let updated = 0;

        for (const appt of appointments) {
            try {
                await Appointment.updateOne(
                    { _id: appt._id },
                    {
                        $set: {
                            status: 'COLLECTED',
                            completedAt: new Date()
                        }
                    }
                );
                const donorName = appt.donorId?.Name || 'Unknown';
                updated++;
            } catch (err) {
                console.error(`❌ Error updating ${appt._id}:`, err.message);
            }
        }


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

markAsCollected();
