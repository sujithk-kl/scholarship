const mongoose = require('mongoose');
require('dotenv').config();

const Document = require('./models/Document');
const ScholarshipApplication = require('./models/ScholarshipApplication');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('=== DATABASE DOCUMENT CHECK ===\n');

    const totalApps = await ScholarshipApplication.countDocuments();
    const totalDocs = await Document.countDocuments();

    console.log('Total Applications:', totalApps);
    console.log('Total Documents:', totalDocs);
    console.log('');

    const recentApps = await ScholarshipApplication.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('_id createdAt currentStatus');

    console.log('Recent Applications:');
    recentApps.forEach(app => {
        console.log(`  ID: ${app._id}`);
        console.log(`  Status: ${app.currentStatus}`);
        console.log(`  Created: ${app.createdAt}`);
        console.log('');
    });

    const allDocs = await Document.find().populate('applicationId', '_id');
    console.log(`All Documents in DB (${allDocs.length}):`);
    if (allDocs.length === 0) {
        console.log('  No documents found!');
    } else {
        allDocs.forEach(doc => {
            console.log(`  - ${doc.documentType}`);
            console.log(`    App ID: ${doc.applicationId?._id || 'null'}`);
            console.log(`    Status: ${doc.verificationStatus}`);
            console.log(`    File: ${doc.fileUrl}`);
            console.log('');
        });
    }

    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
