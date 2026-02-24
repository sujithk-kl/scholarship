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
        enum: ['Submitted', 'Under Review', 'Under Verification', 'Query Raised', 'Resubmitted', 'Approved', 'Rejected'],
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
    },
    applicationType: {
        type: String,
        enum: ['New', 'Renewal'],
        default: 'New'
    },
    applicationYear: {
        type: String,
        default: () => new Date().getFullYear().toString()
    },
    aiVerificationScore: {
        type: Number,
        default: 0
    },
    eligibilityStatus: {
        type: String,
        enum: ['Checking', 'Eligible', 'Not Eligible'],
        default: 'Checking'
    },
    assignedOfficer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    district: {
        type: String // Stored for easier aggregation
    },
    queries: [{
        queryId: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
        verifier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        queryTitle: { type: String, required: true },
        queryMessage: { type: String, required: true },
        raisedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
        response: { type: String },
        respondedAt: { type: Date }
    }]
}, {
    timestamps: true
});

const ScholarshipApplication = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);
module.exports = ScholarshipApplication;
