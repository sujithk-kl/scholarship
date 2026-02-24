const mongoose = require('mongoose');

const donorSchema = mongoose.Schema({
    name: { type: String, default: 'Anonymous' },
    email: { type: String },
    amount: { type: Number, required: true },
    isAnonymous: { type: Boolean, default: false },
    message: { type: String },
    donatedAt: { type: Date, default: Date.now }
});

const crowdfundCampaignSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    courseName: {
        type: String
    },
    instituteName: {
        type: String
    },
    goalAmount: {
        type: Number,
        required: true
    },
    raisedAmount: {
        type: Number,
        default: 0
    },
    donors: [donorSchema],
    status: {
        type: String,
        enum: ['Active', 'Funded', 'Closed'],
        default: 'Active'
    },
    csrPartner: {
        type: String  // Name of CSR company if matched
    },
    category: {
        type: String,
        enum: ['Education', 'Medical', 'Research', 'Sports', 'Arts', 'Other'],
        default: 'Education'
    },
    isOfficial: {
        type: Boolean,
        default: false
    },
    createdByRole: {
        type: String,
        enum: ['Student', 'Admin'],
        default: 'Student'
    }
}, {
    timestamps: true
});

const CrowdfundCampaign = mongoose.model('CrowdfundCampaign', crowdfundCampaignSchema);
module.exports = CrowdfundCampaign;
