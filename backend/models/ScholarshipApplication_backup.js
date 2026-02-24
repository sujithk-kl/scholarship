const mongoose = require('mongoose');

const scholarshipApplicationSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentProfile'
    },
    currentStatus: {
        type: String,
        enum: ['Submitted', 'Under Verification', 'Query Raised', 'Resubmitted', 'Approved', 'Rejected'],
        default: 'Submitted'
    },
    verificationStage: {
        type: String,
        enum: ['Verifier', 'Admin'],
        default: 'Verifier'
    },
    scholarshipAmount: {
        type: Number,
        default: 0
    },
    withdrawnAmount: {
        type: Number,
        default: 0
    },
    withdrawalStatus: {
        type: String,
        enum: ['Not Available', 'Available', 'Partially Withdrawn', 'Fully Withdrawn', 'Withdrawn'],
        default: 'Not Available'
    },
    approvedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);
module.exports = ScholarshipApplication;
