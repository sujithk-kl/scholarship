const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkState = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const apps = await ScholarshipApplication.find({});
        console.log("Current Applications in DB:");
        apps.forEach(app => {
            console.log(`ID: ${app._id}, Status: ${app.currentStatus}, Year: ${app.applicationYear}, Type: ${app.applicationType}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkState();
