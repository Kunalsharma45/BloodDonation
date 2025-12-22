import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/liforce');

const db = mongoose.connection.db;
const users = db.collection('users');

const hospitals = await users.find({ organizationType: 'HOSPITAL' }).toArray();


hospitals.forEach((h, i) => {
});

await mongoose.connection.close();
