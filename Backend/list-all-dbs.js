import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/');

const admin = mongoose.connection.db.admin();
const dbs = await admin.listDatabases();

dbs.databases.forEach((db, i) => {
    const sizeMB = (db.sizeOnDisk / 1024 / 1024).toFixed(2);
});

await mongoose.connection.close();

