import mongoose from 'mongoose';

await mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection.db;
const users = db.collection('users');

// Search for raktdan
const raktdan = await users.findOne({
    $or: [
        { organizationName: /raktdan/i },
        { Name: /raktdan/i }
    ]
});

if (raktdan) {

    if (raktdan.organizationType === 'HOSPITAL') {
    } else if (raktdan.organizationType === 'BANK') {
    }
} else {

    const all = await users.find({ role: 'organization' }).toArray();
    all.forEach(a => {
    });
}

await mongoose.connection.close();
