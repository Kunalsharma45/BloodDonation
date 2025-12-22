import mongoose from 'mongoose';
import User from './modules/User.js';

const databases = ['liforce', 'Lifeforce', 'liforce_db', 'blooddonation', 'blood-donation'];

for (const dbName of databases) {

    await mongoose.connect(`mongodb://localhost:27017/${dbName}`);

    const userCount = await User.countDocuments();

    if (userCount > 0) {
        const bloodBanks = await User.find({ organizationType: 'BANK' }).select('organizationName Name').limit(3);
    }

    await mongoose.connection.close();
}

