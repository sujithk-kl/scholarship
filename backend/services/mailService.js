const nodemailer = require('nodemailer');

/**
 * Configure SMTP transporter
 * Suggestion: Use Gmail App Passwords or a service like SendGrid/Mailtrap
 */
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmailOTP = async (to, otp) => {
    const mailOptions = {
        from: `"Smart Scholarship Portal" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: '🔒 Your Login OTP - Smart Scholarship Portal',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #1e3a8a; text-align: center;">Smart Scholarship Portal</h2>
                <hr>
                <p>Hello,</p>
                <p>You requested a One-Time Password (OTP) to login to your account. Please use the code below:</p>
                <div style="background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #059669;">${otp}</span>
                </div>
                <p style="font-size: 12px; color: #666;">This OTP is valid for <b>5 minutes</b>. Do not share this code with anyone.</p>
                <hr>
                <p style="font-size: 10px; color: #999; text-align: center;">Government of National Scholarship | Student Welfare Department</p>
            </div>
        `
    };

    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.log('--- EMAIL SIMULATION ---');
            console.log('TO:', to);
            console.log('OTP:', otp);
            console.log('REASON: Email credentials missing in .env');
            console.log('------------------------');
            return true;
        }

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Message sent: ${info.messageId} to ${to}`);
        return true;
    } catch (error) {
        console.error(`[EMAIL FAILURE] To: ${to}, Error:`, error.message);
        return false;
    }
};

module.exports = { sendEmailOTP };
