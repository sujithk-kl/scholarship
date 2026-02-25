const mongoose = require('mongoose');

/**
 * OTP Token Model - MongoDB-based OTP storage with auto-expiry.
 * TTL index auto-deletes documents after 5 minutes.
 */
const otpTokenSchema = new mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        index: true
    },
    hash: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    cooldownUntil: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Auto-delete after 5 minutes (TTL index)
    }
});

const OtpToken = mongoose.model('OtpToken', otpTokenSchema);
module.exports = OtpToken;
