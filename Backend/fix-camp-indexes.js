import mongoose from 'mongoose';
import Camp from './modules/Camp.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/';

async function fixCampIndexes() {
    try {
        await mongoose.connect(MONGODB_URI);

        await Camp.collection.dropIndexes();

        await Camp.collection.createIndex({ "location.coordinates.coordinates": "2dsphere" });

        const indexes = await Camp.collection.indexes();

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing camp indexes:', error);
        process.exit(1);
    }
}

fixCampIndexes();
