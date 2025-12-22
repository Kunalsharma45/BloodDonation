import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function restoreToReadyStorage() {
    try {
        await mongoose.connect(MONGODB_URI);

        const db = mongoose.connection.db;
        const donationsCollection = db.collection('donations');

        // Update donations: change status back to "completed" and stage to "ready-storage"
        const result = await donationsCollection.updateMany(
            { status: 'used' },
            {
                $set: {
                    status: 'completed',
                    stage: 'ready-storage'
                }
            }
        );


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

restoreToReadyStorage();
