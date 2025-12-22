import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/liforce';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};

const cleanupRequests = async () => {
    try {
        await mongoose.connect(MONGODB_URI);

        const Request = mongoose.model('Request', new mongoose.Schema({}, { strict: false }));

        // Show all requests with details
        const allRequests = await Request.find({}).lean();

        if (allRequests.length === 0) {
            await mongoose.connection.close();
            rl.close();
            return;
        }

        // Group by status and show summary
        const summary = {};
        allRequests.forEach(req => {
            const status = req.status || 'UNKNOWN';
            summary[status] = (summary[status] || 0) + 1;
        });

        Object.entries(summary).forEach(([status, count]) => {
        });

        // Show details of first few requests
        allRequests.slice(0, 5).forEach((req, idx) => {
            const createdDate = new Date(req.createdAt || req.createdAt);
            const daysAgo = Math.floor((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
        });

        // Ask what to delete

        const choice = await askQuestion('Enter your choice (1-5): ');

        let filter = {};
        let description = '';

        switch (choice.trim()) {
            case '1':
                filter = {};
                description = 'ALL requests';
                break;
            case '2':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                filter = { createdAt: { $lt: thirtyDaysAgo } };
                description = 'requests older than 30 days';
                break;
            case '3':
                filter = { status: { $in: ['FULFILLED', 'CANCELLED'] } };
                description = 'FULFILLED and CANCELLED requests';
                break;
            case '4':
                const statusChoice = await askQuestion('Enter status to delete (OPEN/ASSIGNED/FULFILLED/CANCELLED): ');
                filter = { status: statusChoice.trim().toUpperCase() };
                description = `${statusChoice.trim().toUpperCase()} requests`;
                break;
            case '5':
                await mongoose.connection.close();
                rl.close();
                return;
            default:
                await mongoose.connection.close();
                rl.close();
                return;
        }

        // Count matching requests
        const matchCount = await Request.countDocuments(filter);

        if (matchCount === 0) {
            await mongoose.connection.close();
            rl.close();
            return;
        }

        // Final confirmation
        const confirm = await askQuestion(`⚠️  Are you SURE you want to delete ${matchCount} ${description}? (yes/no): `);

        if (confirm.trim().toLowerCase() === 'yes') {
            const result = await Request.deleteMany(filter);
        } else {
        }

        await mongoose.connection.close();
        rl.close();

    } catch (error) {
        console.error('❌ Error:', error.message);
        rl.close();
        process.exit(1);
    }
};

cleanupRequests();
