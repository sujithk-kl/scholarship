const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const ScholarshipApplication = require('./models/ScholarshipApplication');
const Document = require('./models/Document');

dotenv.config();

const checkDocs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find all applications
        const apps = await ScholarshipApplication.find().populate('student');
        console.log(`Found ${apps.length} applications.`);

        for (const app of apps) {
            console.log(`---`);
            console.log(`App ID: ${app._id}`);
            console.log(`Student: ${app.student ? app.student.name : 'Unknown'} (${app.student?._id})`);
            console.log(`Status: ${app.currentStatus}`);

            const docs = await Document.find({ applicationId: app._id });
            console.log(`Documents Found: ${docs.length}`);
            if (docs.length > 0) {
                docs.forEach(d => {
                    console.log(`  - Type: ${d.documentType}`);
                    console.log(`    URL: ${d.fileUrl}`);
                    console.log(`    Status: ${d.verificationStatus}`);
                });
            } else {
                console.log('  No documents found for this application.');
            }
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDocs();
