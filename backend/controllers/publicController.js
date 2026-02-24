const Announcement = require('../models/Announcement');
const ScholarshipScheme = require('../models/ScholarshipScheme');

// @desc    Get All Announcements (Public)
// @route   GET /api/public/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get All Schemes (Public)
// @route   GET /api/public/schemes
// @access  Public
const getSchemes = async (req, res) => {
    try {
        const schemes = await ScholarshipScheme.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(schemes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getAnnouncements,
    getSchemes
};
