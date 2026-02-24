const Grievance = require('../models/Grievance');

// @desc    Create a new complaint
// @route   POST /api/complaint/create
// @access  Private (Student)
const createComplaint = async (req, res) => {
    try {
        const { subject, description, category } = req.body;
        const attachment = req.file ? `/uploads/grievance/${req.file.filename}` : null;

        const complaint = await Grievance.create({
            studentId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            subject,
            description,
            category,
            attachment,
            type: 'Grievance',
            status: 'Submitted'
        });

        res.status(201).json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get student's complaints
// @route   GET /api/complaint/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
    try {
        const complaints = await Grievance.find({ studentId: req.user._id }).sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all complaints
// @route   GET /api/admin/complaints
// @access  Private (Admin/Officer)
const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Grievance.find({}).populate('studentId', 'name email').sort({ createdAt: -1 });
        res.json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update complaint status/response
// @route   PUT /api/admin/complaint/update/:id
// @access  Private (Admin/Officer)
const updateComplaint = async (req, res) => {
    try {
        const { status, adminResponse } = req.body;
        const complaint = await Grievance.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        complaint.status = status || complaint.status;
        if (adminResponse) complaint.adminResponse = adminResponse;

        await complaint.save();

        // Real-time Notification
        if (req.io) {
            req.io.to(complaint.studentId.toString()).emit('grievance_update', {
                id: complaint._id,
                status: complaint.status
            });
        }

        res.json(complaint);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint
};
