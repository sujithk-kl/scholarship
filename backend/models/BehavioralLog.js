const mongoose = require('mongoose');

const behavioralLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    resource: {
        type: String
    },
    ipAddress: {
        type: String
    },
    riskScore: {
        type: Number,
        default: 0
    },
    severity: {
        type: String,
        enum: ['Info', 'Notice', 'Warning', 'Critical'],
        default: 'Info'
    },
    metadata: {
        type: Object
    }
}, {
    timestamps: true
});

const BehavioralLog = mongoose.model('BehavioralLog', behavioralLogSchema);
module.exports = BehavioralLog;
