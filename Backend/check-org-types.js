import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/Lifeforce');

const db = mongoose.connection.db;
const usersCollection = db.collection('users');

// Get all unique organizationType values
const types = await usersCollection.distinct('organizationType');

// Show sample users with their types
const samples = await usersCollection.find({}).limit(5).toArray();
samples.forEach(u => {
});

await mongoose.connection.close();
