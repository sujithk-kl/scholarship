const StudentProfile = require('../models/StudentProfile');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const { getRecommendations } = require('../services/recommendationService');

/**
 * @desc    Get AI-recommended scholarships for the logged-in student
 * @route   GET /api/student/recommendations
 * @access  Private (Student)
 */
const getStudentRecommendations = async (req, res) => {
    try {
        // Find the student's latest profile
        const application = await ScholarshipApplication.findOne({ student: req.user._id })
            .sort({ createdAt: -1 })
            .populate('profile');

        let profile = application?.profile;

        // If no application yet, try to find profile directly
        if (!profile) {
            profile = await StudentProfile.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        }

        if (!profile) {
            return res.status(404).json({
                message: 'No profile found. Please submit your application first to get recommendations.'
            });
        }

        const recommendations = await getRecommendations(profile);

        res.json({
            totalSchemes: recommendations.length,
            topMatch: recommendations[0] || null,
            recommendations
        });
    } catch (error) {
        console.error('Recommendation Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getStudentRecommendations };
