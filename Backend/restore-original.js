import mongoose from 'mongoose';
import Donation from './modules/Donation.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function restoreOriginal() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Find all donations with status "used" or "stored" and restore them to "completed"
        const result = await Donation.updateMany(
            {
                status: { $in: ['used', 'stored'] },
                stage: { $in: ['completed', 'ready-storage'] }
            },
            {
                $set: { status: 'completed' }
            }
        );


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

restoreOriginal();
