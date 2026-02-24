const mongoose = require('mongoose');

const queryLogSchema = mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScholarshipApplication',
        required: true
    },
    raisedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fieldName: { // Can be a field name (e.g., "personalDetails.fatherName") or document type
        type: String,
        required: true
    },
    queryMessage: {
        type: String,
        required: true
    },
    studentResponse: {
        type: String
    },
    status: {
        type: String,
        enum: ['Open', 'Resolved'],
        default: 'Open'
    }
}, {
    timestamps: true
});

const QueryLog = mongoose.model('QueryLog', queryLogSchema);
module.exports = QueryLog;
