import mongoose from 'mongoose';

const dbs = ['liforce', 'Lifeforce', 'liforce_db', 'blooddonation', 'blood-donation', 'Rowblock', 'test'];


for (const dbName of dbs) {
    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);

    const db = mongoose.connection.db;
    const users = db.collection('users');

    // Search for ANY organization account
    const orgUsers = await users.find({
        $or: [
            { role: 'organization' },
            { organizationType: { $exists: true } }
        ]
    }).toArray();

    if (orgUsers.length > 0) {
        orgUsers.forEach(u => {
        });
    }

    await mongoose.connection.close();
}

