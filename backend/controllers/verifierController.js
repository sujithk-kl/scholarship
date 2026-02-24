const ScholarshipApplication = require('../models/ScholarshipApplication');
const Document = require('../models/Document');
const QueryLog = require('../models/QueryLog');
const { sendSMS } = require('../services/smsService');
const { verifyDocuments } = require('../services/aiVerificationService');

// @desc    Get applications for verification
// @route   GET /api/verifier/applications
// @access  Private (Verifier)
const getApplications = async (req, res) => {
    try {
        const applications = await ScholarshipApplication.find({
            verificationStage: 'Verifier',
            currentStatus: { $in: ['Submitted', 'Resubmitted', 'Under Verification', 'Query Raised'] }
        })
            .populate('student', 'name email')
            .populate('profile'); // Populate profile details

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single application details for review
// @route   GET /api/verifier/application/:id
// @access  Private (Verifier)
const getApplicationById = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findById(req.params.id)
            .populate('student', 'name email')
            .populate('profile');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const documents = await Document.find({ applicationId: application._id });
        const queries = await QueryLog.find({ applicationId: application._id }).populate('raisedBy', 'name role');

        res.json({ application, documents, queries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Verify a document
// @route   PUT /api/verifier/document/:id/verify
// @access  Private (Verifier)
const verifyDocument = async (req, res) => {
    const { status, remarks } = req.body; // status: 'Approved' or 'Rejected'

    try {
        const document = await Document.findById(req.params.id);
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }

        document.verificationStatus = status;
        document.remarks = remarks || document.remarks;
        await document.save();

        res.json(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Raise a query
// @route   POST /api/verifier/query
// @access  Private (Verifier)
const raiseQuery = async (req, res) => {
    const { applicationId, fieldName, queryMessage } = req.body;

    try {
        const application = await ScholarshipApplication.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Add to Embedded Queries Array
        application.queries.push({
            verifier: req.user._id,
            queryTitle: `Query regarding ${fieldName}`,
            queryMessage,
            status: 'Open',
            raisedAt: new Date()
        });

        // Update Application Status
        application.currentStatus = 'Query Raised';
        await application.save();

        // Emit Socket.io event
        if (req.io) {
            req.io.to(application.student.toString()).emit('status_update', 'Query Raised');
        }

        // Send SMS
        const student = await ScholarshipApplication.findById(application._id).populate('student');
        if (student?.student?.mobile) {
            try {
                await sendSMS(student.student.mobile, `Action Required: A query has been raised regarding your scholarship application (${application._id.toString().substring(0, 8)}). Please check your dashboard.`);
            } catch (err) {
                console.error("SMS skip error:", err.message);
            }
        }

        // Optional: Keep QueryLog for separate auditing if needed, but embedded is primary for UI now
        /*
        await QueryLog.create({
            applicationId,
            raisedBy: req.user._id,
            fieldName,
            queryMessage,
            status: 'Open'
        });
        */

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Forward to Admin
// @route   PUT /api/verifier/application/:id/forward
// @access  Private (Verifier)
const forwardToAdmin = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Check if all docs/fields are clear or verified (logic can be added)
        // For now, allow forward
        application.verificationStage = 'Admin';
        application.currentStatus = 'Under Review';
        await application.save();

        // Emit Socket.io event
        if (req.io) {
            req.io.to(application.student.toString()).emit('status_update', 'Under Review');
        }

        // Send SMS
        const student = await ScholarshipApplication.findById(application._id).populate('student');
        if (student?.student?.mobile) {
            await sendSMS(student.student.mobile, `Update: Your scholarship application (${application._id.toString().substring(0, 8)}) is now Under Review by the Admin.`);
        }

        res.json({ message: 'Application forwarded to Admin', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Trigger AI Verification
// @route   POST /api/verifier/application/:id/ai-verify
// @access  Private (Verifier/Admin)
const aiVerifyApplication = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findById(req.params.id)
            .populate('student', 'name email')
            .populate('profile');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const documents = await Document.find({ applicationId: application._id });

        // Run AI Service
        const score = await verifyDocuments(application, documents);

        application.aiVerificationScore = score;
        await application.save();

        res.json({
            message: 'AI Verification Completed',
            score,
            status: score <= 30 ? 'Verified' : score <= 70 ? 'Suspicious' : 'Rejected'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI Verification Failed' });
    }
};

module.exports = {
    getApplications,
    getApplicationById,
    verifyDocument,
    raiseQuery,
    forwardToAdmin,
    aiVerifyApplication
};
