const BehavioralLog = require('../models/BehavioralLog');
const User = require('../models/User');
const { monitorCTLogs } = require('../services/ctLogService');

/**
 * @desc    Get all behavioral logs (for risk timeline)
 * @route   GET /api/security/logs
 * @access  Private (Admin)
 */
const getSecurityLogs = async (req, res) => {
    try {
        const logs = await BehavioralLog.find()
            .populate('user', 'name email threatLevel')
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get security stats (threat levels, alerts)
 * @route   GET /api/security/stats
 * @access  Private (Admin)
 */
const getSecurityStats = async (req, res) => {
    try {
        const highRiskUsers = await User.countDocuments({ threatLevel: 'High' });
        const mediumRiskUsers = await User.countDocuments({ threatLevel: 'Medium' });
        const totalLogs = await BehavioralLog.countDocuments();
        const criticalAlerts = await BehavioralLog.countDocuments({ severity: 'Critical' });

        const ctLogs = await monitorCTLogs();

        res.json({
            highRiskUsers,
            mediumRiskUsers,
            totalLogs,
            criticalAlerts,
            ctLogs
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Clear security data (for cleanup)
 * @route   DELETE /api/security/logs
 * @access  Private (Admin)
 */
const clearLogs = async (req, res) => {
    try {
        await BehavioralLog.deleteMany({});
        res.json({ message: 'Logs cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSecurityLogs,
    getSecurityStats,
    clearLogs
};
