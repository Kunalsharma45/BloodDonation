import mongoose from 'mongoose';

const dbs = ['liforce', 'Lifeforce', 'liforce_db', 'blooddonation', 'blood-donation', 'Rowblock', 'test'];


for (const dbName of dbs) {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Find HOSPITAL type organizations
    const hospitals = await users.find({ organizationType: 'HOSPITAL' }).toArray();

    if (hospitals.length > 0) {

        hospitals.forEach(h => {
        });

    }

    await mongoose.connection.close();
}
