const cron = require('node-cron');
const Document = require('../models/Document');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const { sendSMS } = require('./smsService');

// Run every day at midnight
const initExpiryCheck = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running Daily Document Expiry Check...');
        try {
            const today = new Date();

            // Find approved documents that have reached their expiry date
            const expiredDocs = await Document.find({
                verificationStatus: 'Approved',
                expiryDate: { $lt: today }
            }).populate({
                path: 'applicationId',
                populate: { path: 'student' }
            });

            for (const doc of expiredDocs) {
                console.log(`Document Expired: ${doc.documentType} for Application: ${doc.applicationId._id}`);

                doc.verificationStatus = 'Expired';
                doc.reuploadRequired = true;
                await doc.save();

                // Update Application Status
                const application = doc.applicationId;
                if (application) {
                    application.currentStatus = 'Query Raised'; // Or a specific 'Re-Verification Required' if preferred
                    await application.save();

                    // Notify Student
                    if (application.student?.mobile) {
                        await sendSMS(
                            application.student.mobile,
                            `Alert: Your ${doc.documentType} has EXPIRED. Please login to your Scholarship Portal and re-upload the valid document for re-verification.`
                        );
                    }

                    // Emit socket event if active
                    // Note: This service runs in background, so we'd need to access req.io differently 
                    // if we wanted live updates for users currently online. 
                    // Usually, for a midnight cron, a simple notification is enough.
                }
            }
            console.log(`Expiry check completed. Processed ${expiredDocs.length} documents.`);
        } catch (error) {
            console.error('Error in Expiry Check Service:', error);
        }
    });
};

module.exports = { initExpiryCheck };
