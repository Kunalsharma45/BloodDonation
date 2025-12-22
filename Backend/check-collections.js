import mongoose from 'mongoose';

// Connect
await mongoose.connect('mongodb://localhost:27017/liforce');

// Check all possible collections
const collections = await mongoose.connection.db.listCollections().toArray();

// Check bloodunits collection specifically
const bloodunitsCount = await mongoose.connection.collection('bloodunits').countDocuments();

// Check if there's a BloodUnit with capital letters
const BloodUnitCount = await mongoose.connection.db.collection('BloodUnit').countDocuments().catch(() => 0);

// List all possible blood-related collections
const bloodCollections = collections.filter(c => c.name.toLowerCase().includes('blood'));
for (const col of bloodCollections) {
    const count = await mongoose.connection.collection(col.name).countDocuments();
}

await mongoose.connection.close();
