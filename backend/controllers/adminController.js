const ScholarshipApplication = require('../models/ScholarshipApplication');
const QueryLog = require('../models/QueryLog');
const Document = require('../models/Document');
const { sendSMS } = require('../services/smsService');

// @desc    Get applications for admin approval
// @route   GET /api/admin/applications
// @access  Private (Admin)
const getAdminApplications = async (req, res) => {
    try {
        const applications = await ScholarshipApplication.find({
            verificationStage: 'Admin',
            currentStatus: { $in: ['Under Verification', 'Query Raised', 'Resubmitted'] }
        })
            .populate('student', 'name email')
            .populate('profile');

        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all applications (Overview)
// @route   GET /api/admin/all-applications
// @access  Private (Admin)
const getAllApplications = async (req, res) => {
    try {
        const applications = await ScholarshipApplication.find({})
            .populate('student', 'name email');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve Application
// @route   PUT /api/admin/application/:id/approve
// @access  Private (Admin)
const approveApplication = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const { amount } = req.body;

        application.currentStatus = 'Approved';
        application.scholarshipAmount = amount || 0;
        application.withdrawalStatus = 'Available';
        application.approvedAt = new Date();
        await application.save();

        // Emit Socket.io event
        if (req.io) {
            req.io.to(application.student.toString()).emit('status_update', 'Approved');
        }

        // Send SMS
        const student = await ScholarshipApplication.findById(application._id).populate('student');
        if (student?.student?.mobile) {
            try {
                await sendSMS(student.student.mobile, `Congratulations! Your scholarship application (${application._id.toString().substring(0, 8)}) has been APPROVED. Amount: ₹${application.scholarshipAmount}`);
            } catch (err) {
                console.error("SMS skip error:", err.message);
            }
        }

        res.json({ message: 'Application Approved', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject Application
// @route   PUT /api/admin/application/:id/reject
// @access  Private (Admin)
const rejectApplication = async (req, res) => {
    const { reason } = req.body;
    try {
        const application = await ScholarshipApplication.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.currentStatus = 'Rejected';
        // Optionally save reason in QueryLog or separate RejectionLog
        // For now, let's create a resolved query log as a record of rejection
        await QueryLog.create({
            applicationId: application._id,
            raisedBy: req.user._id,
            fieldName: 'Overall Application',
            queryMessage: `Application Rejected: ${reason}`,
            status: 'Resolved'
        });

        await application.save();

        // Emit Socket.io event
        if (req.io) {
            req.io.to(application.student.toString()).emit('status_update', 'Rejected');
        }

        // Send SMS
        const student = await ScholarshipApplication.findById(application._id).populate('student');
        if (student?.student?.mobile) {
            await sendSMS(student.student.mobile, `Alert: Your scholarship application (${application._id.toString().substring(0, 8)}) has been REJECTED. Reason: ${reason}`);
        }

        res.json({ message: 'Application Rejected', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const Announcement = require('../models/Announcement');
const ScholarshipScheme = require('../models/ScholarshipScheme');

// @desc    Create Announcement
// @route   POST /api/admin/announcement
// @access  Private (Admin)
const createAnnouncement = async (req, res) => {
    try {
        const { title, content, type, date } = req.body;
        const announcement = await Announcement.create({
            title,
            content,
            type,
            date,
            createdBy: req.user._id
        });
        res.status(201).json(announcement);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Announcement
// @route   DELETE /api/admin/announcement/:id
// @access  Private (Admin)
const deleteAnnouncement = async (req, res) => {
    try {
        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement Removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Announcements (Admin View)
// @route   GET /api/admin/announcements
// @access  Private (Admin)
const getAllAnnouncementsAdmin = async (req, res) => {
    try {
        const announcements = await Announcement.find({}).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create Scholarship Scheme
// @route   POST /api/admin/scheme
// @access  Private (Admin)
const createScheme = async (req, res) => {
    try {
        const {
            name,
            description,
            amount,
            deadline,
            eligibility,
            incomeCap,
            minMarks,
            eligibleCategories,
            eligibleStates,
            tags
        } = req.body;

        const scheme = await ScholarshipScheme.create({
            name,
            description,
            amount: Number(amount),
            deadline,
            eligibility,
            incomeCap: incomeCap ? Number(incomeCap) : 500000,
            minMarks: minMarks ? Number(minMarks) : 50,
            eligibleCategories: eligibleCategories || [],
            eligibleStates: eligibleStates || [],
            tags: tags || [],
            createdBy: req.user._id
        });
        res.status(201).json(scheme);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete Scholarship Scheme
// @route   DELETE /api/admin/scheme/:id
// @access  Private (Admin)
const deleteScheme = async (req, res) => {
    try {
        await ScholarshipScheme.findByIdAndDelete(req.params.id);
        res.json({ message: 'Scheme Removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Schemes (Admin View)
// @route   GET /api/admin/schemes
// @access  Private (Admin)
const getAllSchemesAdmin = async (req, res) => {
    try {
        const schemes = await ScholarshipScheme.find({}).sort({ createdAt: -1 });
        res.json(schemes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



const Grievance = require('../models/Grievance');

// @desc    Get All Grievances
// @route   GET /api/admin/grievances
// @access  Private (Admin)
const getAllGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({}).sort({ createdAt: -1 });
        res.json(grievances);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Grievance Status
// @route   PUT /api/admin/grievance/:id/status
// @access  Private (Admin)
const updateGrievanceStatus = async (req, res) => {
    try {
        const { status, adminReply } = req.body;
        const grievance = await Grievance.findById(req.params.id);

        if (!grievance) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        grievance.status = status || grievance.status;
        if (adminReply) grievance.adminReply = adminReply;

        await grievance.save();
        res.json(grievance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Generic Application Status
// @route   PUT /api/admin/application/:id/status
// @access  Private (Admin)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await ScholarshipApplication.findById(req.params.id).populate('student');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.currentStatus = status;
        await application.save();

        // Emit Socket.io event
        if (req.io) {
            req.io.to(application.student._id.toString()).emit('status_update', status);
        }

        // Send SMS
        if (application.student?.mobile) {
            await sendSMS(application.student.mobile, `Your scholarship application status has been updated to: ${status}`);
        }

        res.json({ message: `Status updated to ${status}`, application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAdminApplications,
    getAllApplications,
    approveApplication,
    rejectApplication,
    createAnnouncement,
    deleteAnnouncement,
    createScheme,
    deleteScheme,
    getAllAnnouncementsAdmin,
    getAllSchemesAdmin,
    getAllGrievances,
    updateGrievanceStatus,
    updateApplicationStatus
};
