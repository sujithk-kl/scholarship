const mongoose = require('mongoose');

const scholarshipSchemeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    eligibility: {
        type: String,
        required: true
    },
    // Structured eligibility fields for AI Recommendation Engine
    incomeCap: {
        type: Number,
        default: 500000
    },
    minMarks: {
        type: Number,
        default: 50
    },
    eligibleCategories: [{
        type: String,
        enum: ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority']
    }],
    eligibleStates: [{
        type: String
    }],
    tags: [{
        type: String  // e.g. "Engineering", "Medical", "Arts", "Science", "Commerce"
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const ScholarshipScheme = mongoose.model('ScholarshipScheme', scholarshipSchemeSchema);
module.exports = ScholarshipScheme;
