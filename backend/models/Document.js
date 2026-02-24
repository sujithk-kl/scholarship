const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScholarshipApplication',
        required: true
    },
    documentType: {
        type: String,
        required: true,
        enum: ['Aadhar Card', 'Income Certificate', 'Caste Certificate', 'Academic Marksheet', 'Bank Passbook', 'General Document', 'Domicile Certificate']
    },
    fileUrl: {
        type: String,
        required: true
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Expired', 'Re-Verification Required'],
        default: 'Pending'
    },
    issueDate: {
        type: Date
    },
    expiryDate: {
        type: Date
    },
    reuploadRequired: {
        type: Boolean,
        default: false
    },
    remarks: {
        type: String
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
