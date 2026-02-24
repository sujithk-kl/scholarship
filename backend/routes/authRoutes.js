const express = require('express');
const { registerUser, sendOtp, verifyOtp, logoutUser } = require('../controllers/authController');
const { otpLimiter, verificationLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/register', registerUser);
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', verificationLimiter, verifyOtp);
router.post('/logout', logoutUser);

module.exports = router;
