const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User'); // Adjust path as needed
const ScholarshipApplication = require('./backend/models/ScholarshipApplication');
const Document = require('./backend/models/Document');

dotenv.config({ path: './backend/.env' });

const checkDocs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the student 'sriaditya' (from screenshot) or just list all apps
        const apps = await ScholarshipApplication.find().populate('student');
        console.log(`Found ${apps.length} applications.`);

        for (const app of apps) {
            console.log(`\nApp ID: ${app._id}`);
            console.log(`Student: ${app.student ? app.student.name : 'Unknown'}`);
            console.log(`Status: ${app.currentStatus}`);

            const docs = await Document.find({ applicationId: app._id });
            console.log(`Documents Found: ${docs.length}`);
            docs.forEach(d => console.log(` - Type: ${d.documentType}, URL: ${d.fileUrl}, ID: ${d._id}`));
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDocs();
