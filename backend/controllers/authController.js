const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const OTPService = require('../services/otpService');
const { sendSMS } = require('../services/smsService');
const { sendEmailOTP } = require('../services/mailService');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role, mobile } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        mobile
    });

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @desc    Send OTP to user (Email or Mobile)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    const { identifier } = req.body; // Can be email or mobile

    if (!identifier) {
        return res.status(400).json({ message: 'Email or Mobile Number is required' });
    }

    // Security Check: Resend Cooldown
    const isCoolingDown = await OTPService.isCoolingDown(identifier);
    if (isCoolingDown) {
        return res.status(429).json({ message: 'Please wait 30 seconds before requesting a new OTP.' });
    }

    const user = await User.findOne({
        $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found. Please register first.' });
    }

    const otp = OTPService.generateOTP();

    // Hash and store in Redis with 5-min TTL
    await OTPService.storeOTP(identifier, otp);

    // Delivery Strategy
    if (identifier.includes('@')) {
        // Real Email Delivery
        await sendEmailOTP(identifier, otp);
    } else {
        // Real SMS Delivery (if mobile)
        await sendSMS(identifier, `Your Smart Scholarship Portal OTP is: ${otp}. Valid for 5 minutes.`);
    }

    // Mock/Secure logging for developers
    console.log(`[SECURE LOG] OTP generated for ${identifier}: ${otp}`);

    // In production, NEVER return the OTP in the JSON response
    res.status(200).json({
        message: 'OTP sent successfully'
    });
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
        return res.status(400).json({ message: 'Identifier and OTP are required' });
    }

    try {
        const isValid = await OTPService.verifyOTP(identifier, otp);

        if (!isValid) {
            return res.status(401).json({ message: 'Invalid OTP. Attempts incremented.' });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { mobile: identifier }]
        });

        if (!user) {
            return res.status(404).json({ message: 'User account no longer exists' });
        }

        // Success: Clean login and issue JWT
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            mobile: user.mobile
        });

    } catch (error) {
        // Detailed error messages handled (e.g., "Max attempts exceeded")
        return res.status(401).json({ message: error.message });
    }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    registerUser,
    sendOtp,
    verifyOtp,
    logoutUser
};
