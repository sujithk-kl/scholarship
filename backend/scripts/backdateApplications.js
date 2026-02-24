const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const backdateApplications = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Find all applications that are Approved and have applicationYear as current year
        const currentYear = new Date().getFullYear().toString();
        const previousYear = (new Date().getFullYear() - 1).toString();

        const applications = await ScholarshipApplication.find({
            currentStatus: 'Approved',
            applicationYear: currentYear
        });

        console.log(`Found ${applications.length} approved applications from ${currentYear}. Backdating to ${previousYear}...`);

        for (const app of applications) {
            app.applicationYear = previousYear;
            await app.save();
            console.log(`Updated application ${app._id} year to ${previousYear}`);
        }

        console.log('Backdating complete.');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

backdateApplications();
