const Document = require('../models/Document');
const ScholarshipApplication = require('../models/ScholarshipApplication');

// @desc    Re-upload an expired document
// @route   PUT /api/student/reupload/:id
// @access  Private (Student)
const reuploadDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Ensure file was uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        // Update document
        document.fileUrl = `/uploads/${req.file.filename}`;
        document.verificationStatus = 'Re-Verification Required';
        document.reuploadRequired = false;

        // Update dates if provided in body (optional, usually system sets expiry later)
        if (req.body.issueDate) document.issueDate = req.body.issueDate;
        if (req.body.expiryDate) document.expiryDate = req.body.expiryDate;

        await document.save();

        // Update application status to notify officers
        const application = await ScholarshipApplication.findById(document.applicationId);
        if (application) {
            application.currentStatus = 'Resubmitted';
            await application.save();
        }

        res.json({ message: 'Document re-uploaded successfully', document });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications with expired documents
// @route   GET /api/admin/expired-documents
// @access  Private (Admin/Officer)
const getExpiredDocuments = async (req, res) => {
    try {
        const expiredDocs = await Document.find({
            verificationStatus: { $in: ['Expired', 'Re-Verification Required'] }
        }).populate({
            path: 'applicationId',
            populate: { path: 'student', select: 'name email' }
        });

        res.json(expiredDocs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    reuploadDocument,
    getExpiredDocuments
};
