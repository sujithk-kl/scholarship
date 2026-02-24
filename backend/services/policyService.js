const ScholarshipApplication = require('../models/ScholarshipApplication');
const StudentProfile = require('../models/StudentProfile');

/**
 * Detects policy abuse across applications (e.g., duplicate details across accounts).
 */
const detectAbuse = async (studentId, profileData) => {
    const alerts = [];

    // 1. Check for duplicate Aadhaar
    if (profileData.personalDetails?.aadharNumber) {
        const duplicateAadhaar = await StudentProfile.findOne({
            'personalDetails.aadharNumber': profileData.personalDetails.aadharNumber,
            student: { $ne: studentId }
        });
        if (duplicateAadhaar) {
            alerts.push({
                type: 'Policy Abuse',
                severity: 'Critical',
                message: 'Duplicate Aadhaar card number found across multiple accounts.'
            });
        }
    }

    // 2. Check for duplicate Bank Account
    if (profileData.bankDetails?.accountNumber) {
        const duplicateBank = await StudentProfile.findOne({
            'bankDetails.accountNumber': profileData.bankDetails.accountNumber,
            student: { $ne: studentId }
        });
        if (duplicateBank) {
            alerts.push({
                type: 'Policy Abuse',
                severity: 'Warning',
                message: 'Bank account number is already linked to another student profile.'
            });
        }
    }

    // 3. Check for multiple active applications in the same year
    const currentYear = new Date().getFullYear().toString();
    const existingApps = await ScholarshipApplication.find({
        student: studentId,
        applicationYear: currentYear
    });

    if (existingApps.length > 0) {
        alerts.push({
            type: 'Policy Abuse',
            severity: 'Notice',
            message: 'User is attempting to submit multiple applications for the same academic year.'
        });
    }

    return alerts;
};

module.exports = { detectAbuse };
