const BehavioralLog = require('../models/BehavioralLog');
const User = require('../models/User');

/**
 * Middleware to track user behavior and update risk profiles.
 */
const trackBehavior = async (req, res, next) => {
    if (!req.user) {
        return next();
    }

    const action = `${req.method} ${req.originalUrl}`;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Log the action
    const log = await BehavioralLog.create({
        user: req.user._id,
        action,
        ipAddress,
        severity: 'Info'
    });

    // Simple Risk Logic: Unusual IP or repeated rapid requests
    // (In a real system, this would be much more sophisticated)

    next();
};

/**
 * Middleware to update threat levels based on suspicious activities.
 */
const securityWatch = async (req, res, next) => {
    if (!req.user) return next();

    // Check if user is already at High threat level
    if (req.user.threatLevel === 'High') {
        console.log(`[Security] High risk user ${req.user.name} accessing system.`);
        // Could implement additional challenges here (MFA, IP lock)
    }

    next();
};

module.exports = { trackBehavior, securityWatch };
