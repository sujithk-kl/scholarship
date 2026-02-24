const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipApplication = require('./models/ScholarshipApplication');
const StudentProfile = require('./models/StudentProfile');

dotenv.config();

const updateApp = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the application (assuming single student for now, or finding by status)
        const app = await ScholarshipApplication.findOne().sort({ createdAt: -1 }); // Get latest

        if (app) {
            console.log(`Updating App ID: ${app._id}`);
            app.scholarshipAmount = 50000;
            app.withdrawalStatus = 'Available';
            app.currentStatus = 'Approved';
            await app.save();
            console.log('Updated successfully: Amount set to 50000, Status Available');
        } else {
            console.log('No application found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateApp();
