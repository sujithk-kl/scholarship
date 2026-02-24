const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipApplication = require('./models/ScholarshipApplication');

dotenv.config();

const resetApp = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const app = await ScholarshipApplication.findOne().sort({ createdAt: -1 });

        if (app) {
            console.log(`Resetting App ID: ${app._id}`);
            app.scholarshipAmount = 50000;
            app.withdrawnAmount = 0; // Reset withdrawn amount
            app.withdrawalStatus = 'Available'; // Reset status to Available
            app.currentStatus = 'Approved';
            await app.save();
            console.log('Reset successful: Amount 50000, Withdrawn 0, Status Available');
        } else {
            console.log('No application found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetApp();
