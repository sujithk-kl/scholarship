const OtpToken = require('../models/OtpToken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Service to manage OTP lifecycle using MongoDB as a secure, persistent store.
 * OTPs are hashed before storage. TTL index auto-deletes them after 5 minutes.
 */
class OTPService {
    /**
     * Generate a 6-digit numeric OTP
     */
    static generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Store hashed OTP in MongoDB with 5-min auto-expiry
     * @param {string} identifier (Email or Mobile)
     * @param {string} otp
     */
    static async storeOTP(identifier, otp) {
        const hash = await bcrypt.hash(otp, 10);
        const cooldownUntil = new Date(Date.now() + 30 * 1000); // 30s cooldown

        // Upsert: replace any existing OTP for this identifier
        await OtpToken.findOneAndUpdate(
            { identifier },
            {
                identifier,
                hash,
                attempts: 0,
                cooldownUntil,
                createdAt: new Date()
            },
            { upsert: true, new: true }
        );
    }

    /**
     * Verify OTP against hashed version in MongoDB
     * @param {string} identifier
     * @param {string} otp
     * @returns {boolean} isValid
     */
    static async verifyOTP(identifier, otp) {
        const record = await OtpToken.findOne({ identifier });

        if (!record) {
            throw new Error('OTP expired or not found');
        }

        if (record.attempts >= 3) {
            await OtpToken.deleteOne({ identifier });
            throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
        }

        const isMatch = await bcrypt.compare(otp, record.hash);

        if (!isMatch) {
            await OtpToken.updateOne({ identifier }, { $inc: { attempts: 1 } });
            return false;
        }

        // Success: delete OTP record
        await OtpToken.deleteOne({ identifier });
        return true;
    }

    /**
     * Check if user is in 30-second resend cooldown
     * @param {string} identifier
     * @returns {boolean}
     */
    static async isCoolingDown(identifier) {
        const record = await OtpToken.findOne({ identifier });
        if (!record || !record.cooldownUntil) return false;
        return record.cooldownUntil > new Date();
    }
}

module.exports = OTPService;
