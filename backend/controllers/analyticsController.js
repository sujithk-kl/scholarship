const ScholarshipApplication = require('../models/ScholarshipApplication');
const mongoose = require('mongoose');

// @desc    Get summary statistics
// @route   GET /api/admin/analytics/summary
// @access  Private (Admin)
const getSummaryStats = async (req, res) => {
    try {
        const stats = await ScholarshipApplication.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    approved: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'Approved'] }, 1, 0] }
                    },
                    rejected: {
                        $sum: { $cond: [{ $eq: ['$currentStatus', 'Rejected'] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $in: ['$currentStatus', ['Submitted', 'Under Verification', 'Resubmitted']] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json(stats[0] || { total: 0, approved: 0, rejected: 0, pending: 0 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get applications grouped by district
// @route   GET /api/admin/analytics/district
// @access  Private (Admin)
const getDistrictStats = async (req, res) => {
    try {
        const stats = await ScholarshipApplication.aggregate([
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    district: '$_id',
                    count: 1,
                    _id: 0
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get monthly application trends (last 12 months)
// @route   GET /api/admin/analytics/monthly
// @access  Private (Admin)
const getMonthlyTrends = async (req, res) => {
    try {
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0);

        const stats = await ScholarshipApplication.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format data for frontend (e.g., "Jan", "Feb")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedStats = stats.map(s => ({
            month: `${monthNames[s._id.month - 1]} ${s._id.year}`,
            applications: s.count
        }));

        res.json(formattedStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSummaryStats,
    getDistrictStats,
    getMonthlyTrends
};
