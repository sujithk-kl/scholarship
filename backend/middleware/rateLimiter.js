const rateLimit = require('express-rate-limit');

// Rate limiter for OTP generation (Prevents SMS Spam/Abuse)
// Limit: 5 requests per hour per IP
const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: {
        message: 'Too many OTP requests from this IP. Please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for OTP verification (Prevents Brute Force)
// Limit: 10 attempts per 15 minutes per IP
const verificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        message: 'Too many verification attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { otpLimiter, verificationLimiter };
