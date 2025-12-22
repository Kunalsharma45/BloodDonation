import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const checkUser = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        // Find user with "raktt" in name
        const user = await User.findOne({ Name: /raktt/i }).lean();

        if (!user) {
            await mongoose.connection.close();
            return;
        }


        if (!user.organizationType) {

            await User.updateOne(
                { _id: user._id },
                { $set: { organizationType: 'BANK' } }
            );

        } else if (user.organizationType !== 'BANK' && user.organizationType !== 'BOTH') {

            await User.updateOne(
                { _id: user._id },
                { $set: { organizationType: 'BANK' } }
            );

        } else {
        }

        await mongoose.connection.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
};

checkUser();
