const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipApplication = require('./models/ScholarshipApplication');

dotenv.config();

const backfillApprovedAt = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const app = await ScholarshipApplication.findOne().sort({ createdAt: -1 });

        if (app) {
            console.log(`Updating App ID: ${app._id}`);
            // Set approvedAt to now if it's missing and approved
            if (app.currentStatus === 'Approved') {
                app.approvedAt = new Date();
                await app.save();
                console.log('Updated approvedAt to now.');
            } else {
                console.log('App is not in Approved status, skipping date update.');
            }
        } else {
            console.log('No application found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

backfillApprovedAt();
