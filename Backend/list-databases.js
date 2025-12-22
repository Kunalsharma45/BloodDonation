import mongoose from 'mongoose';

// Connect to MongoDB without specifying database
await mongoose.connect('mongodb://localhost:27017/');

// List all databases
const admin = mongoose.connection.db.admin();
const dbs = await admin.listDatabases();

dbs.databases.forEach((db, i) => {
});

await mongoose.connection.close();
