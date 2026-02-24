const redisClient = require('../config/redis');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

/**
 * Service to manage OTP lifecycle using Redis as a secure, temporary store.
 * Design Choice: We hash the OTP even in Redis to prevent "Cleartext Cache" vulnerabilities.
 */
class OTPService {
    /**
     * Generate a 6-digit numeric OTP
     */
    static generateOTP() {
        return crypto.randomInt(100000, 999999).toString();
    }

    /**
     * Store hashed OTP in Redis with TTL
     * @param {string} identifier (Phone or Email)
     * @param {string} otp 
     * @param {number} ttlSeconds (Default 300s / 5min)
     */
    static async storeOTP(identifier, otp, ttlSeconds = 300) {
        const hash = await bcrypt.hash(otp, 10);
        const key = `otp:${identifier}`;

        // Store as a hash map to include attempt counter
        await redisClient.hset(key, {
            hash: hash,
            attempts: 0
        });

        await redisClient.expire(key, ttlSeconds);

        // Set resend-cooldown key (30 seconds)
        await redisClient.set(`cooldown:${identifier}`, 'true', 'EX', 30);
    }

    /**
     * Verify OTP against hashed version in Redis
     * @param {string} identifier 
     * @param {string} otp 
     * @returns {boolean} isValid
     */
    static async verifyOTP(identifier, otp) {
        const key = `otp:${identifier}`;
        const data = await redisClient.hgetall(key);

        if (!data || !data.hash) {
            throw new Error('OTP expired or not found');
        }

        const attempts = parseInt(data.attempts);
        if (attempts >= 3) {
            await redisClient.del(key);
            throw new Error('Maximum verification attempts exceeded. Please request a new OTP.');
        }

        const isMatch = await bcrypt.compare(otp, data.hash);

        if (!isMatch) {
            await redisClient.hincrby(key, 'attempts', 1);
            return false;
        }

        // Success: Clean up
        await redisClient.del(key);
        await redisClient.del(`cooldown:${identifier}`);
        return true;
    }

    /**
     * Check if user is in resend cooldown
     */
    static async isCoolingDown(identifier) {
        const exists = await redisClient.exists(`cooldown:${identifier}`);
        return exists === 1;
    }
}

module.exports = OTPService;
