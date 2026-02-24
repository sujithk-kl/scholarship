const mongoose = require('mongoose');

const studentProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    personalDetails: {
        fullName: String,
        email: String,
        fatherName: String,
        motherName: String,
        dob: Date,
        gender: String,
        aadhaarNumber: String,
        phone: String,
        address: String,
        state: String,
        district: String,
        taluka: String,
        pincode: String,
        casteCategory: String,
        caste: String
    },
    academicDetails: {
        instituteName: String,
        course: String,
        year: String,
        cgpa: String,
        previousYearPercentage: Number,
        attendancePercentage: Number
    },
    financialDetails: {
        annualIncome: Number,
        bankAccountNo: String,
        ifscCode: String
    }
}, {
    timestamps: true
});

const StudentProfile = mongoose.model('StudentProfile', studentProfileSchema);
module.exports = StudentProfile;
