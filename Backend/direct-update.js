import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

async function directUpdate() {
    try {
        await mongoose.connect(MONGODB_URI);

        // Direct MongoDB update - bypass Mongoose validation
        const db = mongoose.connection.db;
        const donationsCollection = db.collection('donations');

        // Find donations with status "completed"
        const result = await donationsCollection.updateMany(
            { status: 'completed' },
            { $set: { status: 'used' } }
        );


        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

directUpdate();
