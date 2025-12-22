import mongoose from 'mongoose';

// Databases to remove (empty or unused)
const databasesToRemove = [
    'liforce',        // empty (0 users)
    'liforce_db',     // empty (0 users)  
    'blooddonation',  // empty (0 users)
    'blood-donation'  // empty (0 users)
];


for (const dbName of databasesToRemove) {
    try {
        await mongoose.connect(`mongodb://localhost:27017/${dbName}`);

        await mongoose.connection.dropDatabase();

        await mongoose.connection.close();
    } catch (error) {
        console.error(`❌ Failed to delete ${dbName}:`, error.message);
    }
}

