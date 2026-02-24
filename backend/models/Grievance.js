const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Technical Issue', 'Payment Problem', 'Verification Delay', 'Profile Update', 'Other'],
        required: true
    },
    attachment: {
        type: String // filePath
    },
    status: {
        type: String,
        enum: ['Submitted', 'Under Review', 'Resolved', 'Closed'],
        default: 'Submitted'
    },
    type: { // Required to support existing logic if any
        type: String,
        enum: ['Helpdesk', 'Grievance'],
        default: 'Grievance'
    },
    adminResponse: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
