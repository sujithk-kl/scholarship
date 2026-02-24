const ScholarshipApplication = require('../models/ScholarshipApplication');
const StudentProfile = require('../models/StudentProfile');
const Document = require('../models/Document');
const Grievance = require('../models/Grievance');
const { verifyDocuments } = require('../services/aiVerificationService');
const { checkEligibility } = require('../services/eligibilityService');

// @desc    Submit scholarship application
// @route   POST /api/student/submit
// @access  Private (Student)
const submitApplication = async (req, res) => {
    try {
        console.log('--- Submit Application Request ---');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Req Files:', req.files ? Object.keys(req.files) : 'No files');
        console.log('Req Body Keys:', Object.keys(req.body));

        const { personalDetails, academicDetails, financialDetails } = req.body;

        // Parse JSON strings if they come as strings (due to FormData)
        const pDetails = typeof personalDetails === 'string' ? JSON.parse(personalDetails) : personalDetails;
        const aDetails = typeof academicDetails === 'string' ? JSON.parse(academicDetails) : academicDetails;
        const fDetails = typeof financialDetails === 'string' ? JSON.parse(financialDetails) : financialDetails;

        // Check if application already exists
        const existingApp = await ScholarshipApplication.findOne({ student: req.user._id });
        if (existingApp) {
            return res.status(400).json({ message: 'Application already submitted' });
        }

        // Create Profile
        const profile = await StudentProfile.create({
            user: req.user._id,
            personalDetails: pDetails,
            academicDetails: aDetails,
            financialDetails: fDetails
        });

        // 🛡️ SECURITY: Policy Abuse Detection
        const { detectAbuse } = require('../services/policyService');
        const policyAlerts = await detectAbuse(req.user._id, { personalDetails: pDetails, bankDetails: fDetails });
        if (policyAlerts.length > 0) {
            console.warn('⚠️ Policy Abuse Detected:', policyAlerts);
            // Log it
            const BehavioralLog = require('../models/BehavioralLog');
            await BehavioralLog.create({
                user: req.user._id,
                action: 'Application Submission - Policy Violation',
                severity: 'Warning',
                metadata: { alerts: policyAlerts }
            });

            // Optionally update threat level
            req.user.threatLevel = 'Medium';
            await req.user.save();
        }

        // Create Application
        // Check Eligibility
        const eligibilityStatus = checkEligibility(profile);

        // Calculate AI Verification Score (Simulated)
        const aiScore = await verifyDocuments({});

        // Create Application
        const application = await ScholarshipApplication.create({
            student: req.user._id,
            profile: profile._id,
            currentStatus: 'Submitted',
            verificationStage: 'Verifier',
            eligibilityStatus: eligibilityStatus,
            aiVerificationScore: aiScore,
            district: profile.personalDetails.district
        });


        // Handle Documents
        if (req.files) {
            console.log('📄 Processing uploaded documents...');

            // 🛡️ SECURITY: Secure Sandbox File Scanning
            const { scanFile } = require('../services/sandboxService');
            const BehavioralLog = require('../models/BehavioralLog');

            const documentPromises = [];
            const docTypeMap = {
                'aadhar': 'Aadhar Card',
                'caste': 'Caste Certificate',
                'income': 'Income Certificate',
                'bankPassbook': 'Bank Passbook',
                'marksheet': 'Academic Marksheet'
            };

            for (const field of Object.keys(req.files)) {
                const files = req.files[field];
                for (const file of files) {
                    // Perform Sandbox Scan
                    const scanResult = await scanFile(file);

                    if (!scanResult.safe) {
                        console.error(`🚨 MALICIOUS FILE DETECTED: ${file.filename}`);
                        await BehavioralLog.create({
                            user: req.user._id,
                            action: 'Malicious File Upload Attempt',
                            resource: file.filename,
                            riskScore: 90,
                            severity: 'Critical',
                            metadata: scanResult
                        });

                        req.user.threatLevel = 'High';
                        await req.user.save();

                        return res.status(403).json({
                            message: 'Security Alert: Malicious file pattern detected. This incident has been logged.',
                            details: scanResult.details
                        });
                    }

                    const docType = docTypeMap[field] || 'General Document';
                    documentPromises.push(
                        Document.create({
                            applicationId: application._id,
                            documentType: docType,
                            fileUrl: `/uploads/${file.filename}`,
                            verificationStatus: 'Pending'
                        })
                    );
                }
            }

            const savedDocs = await Promise.all(documentPromises);
            console.log(`📊 Total documents saved: ${savedDocs.length}`);
        } else {
            console.log('⚠️  No files uploaded with this application');
        }

        res.status(201).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get application status
// @route   GET /api/student/status
// @access  Private (Student)
const getApplicationStatus = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findOne({ student: req.user._id })
            .sort({ createdAt: -1 })
            .populate('profile')
            .populate('student', 'name email');

        if (application) {
            const documents = await Document.find({ applicationId: application._id });
            res.json({ application, documents });
        } else {
            console.log(`No application found for student: ${req.user._id}`);
            res.status(404).json({ message: 'Application not found' });
        }
    } catch (error) {
        console.error("Error in getApplicationStatus:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Resubmit scholarship application (Respond to Query)
// @route   POST /api/student/resubmit
// @access  Private (Student)
const resubmitApplication = async (req, res) => {
    try {
        const { personalDetails, academicDetails, financialDetails } = req.body;

        const application = await ScholarshipApplication.findOne({ student: req.user._id }).sort({ createdAt: -1 });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update Profile
        const pDetails = typeof personalDetails === 'string' ? JSON.parse(personalDetails) : personalDetails;
        const aDetails = typeof academicDetails === 'string' ? JSON.parse(academicDetails) : academicDetails;
        const fDetails = typeof financialDetails === 'string' ? JSON.parse(financialDetails) : financialDetails;

        await StudentProfile.findByIdAndUpdate(application.profile, {
            personalDetails: pDetails,
            academicDetails: aDetails,
            financialDetails: fDetails
        });

        // Resolve Open Queries automatically on resubmission
        if (application.queries && application.queries.length > 0) {
            application.queries.forEach(q => {
                if (q.status === 'Open') {
                    q.status = 'Resolved';
                    q.response = 'Student resubmitted application with updates.';
                    q.respondedAt = new Date();
                }
            });
        }

        // Update Application Status
        application.currentStatus = 'Resubmitted';
        application.verificationStage = 'Verifier';
        await application.save();

        // Handle New Documents
        if (req.files) {
            console.log('📄 [RESUBMIT] Processing uploaded documents...');
            console.log('Files received:', Object.keys(req.files));

            const documentPromises = [];
            const docTypeMap = {
                'aadhar': 'Aadhar Card',
                'caste': 'Caste Certificate',
                'income': 'Income Certificate',
                'bankPassbook': 'Bank Passbook',
                'marksheet': 'Academic Marksheet'
            };

            Object.keys(req.files).forEach(field => {
                const files = req.files[field];
                console.log(`Processing ${field}: ${files.length} file(s)`);

                files.forEach(file => {
                    const docType = docTypeMap[field] || 'General Document';
                    console.log(`Creating document record: ${docType} -> ${file.filename}`);

                    documentPromises.push(
                        Document.create({
                            applicationId: application._id,
                            documentType: docType,
                            fileUrl: `/uploads/${file.filename}`,
                            verificationStatus: 'Pending'
                        }).then(doc => {
                            console.log(`✅ Document saved: ${doc.documentType} (ID: ${doc._id})`);
                            return doc;
                        }).catch(err => {
                            console.error(`❌ Failed to save ${docType}:`, err.message);
                            throw err;
                        })
                    );
                });
            });

            const savedDocs = await Promise.all(documentPromises);
            console.log(`📊 [RESUBMIT] Total documents saved: ${savedDocs.length}`);
        } else {
            console.log('⚠️  [RESUBMIT] No files uploaded');
        }

        res.status(200).json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Renew scholarship application
// @route   POST /api/student/renew
// @access  Private (Student)
const renewApplication = async (req, res) => {
    try {
        const { personalDetails, academicDetails, financialDetails } = req.body;

        // Check if previous application exists and is Approved
        const previousApp = await ScholarshipApplication.findOne({
            student: req.user._id,
            currentStatus: 'Approved'
        }).sort({ createdAt: -1 }); // Get the latest approved one

        if (!previousApp) {
            return res.status(400).json({ message: 'You are not eligible for renewal. No previously approved application found.' });
        }

        // Check if already applied for renewal this year (simple check)
        const currentYear = new Date().getFullYear().toString();
        const existingRenewal = await ScholarshipApplication.findOne({
            student: req.user._id,
            applicationYear: currentYear
        });

        if (existingRenewal) {
            return res.status(400).json({ message: 'You have already applied for a scholarship this year.' });
        }

        // Parse Details
        const pDetails = typeof personalDetails === 'string' ? JSON.parse(personalDetails) : personalDetails;
        const aDetails = typeof academicDetails === 'string' ? JSON.parse(academicDetails) : academicDetails;
        const fDetails = typeof financialDetails === 'string' ? JSON.parse(financialDetails) : financialDetails;

        // Create New Profile or Update Existing?
        // Let's create a new profile snapshot for this application or just link to a new one.
        // For simplicity and history tracking, let's create a new profile entry linked to this new application.
        const profile = await StudentProfile.create({
            user: req.user._id,
            personalDetails: pDetails,
            academicDetails: aDetails,
            financialDetails: fDetails
        });

        // Create Renewal Application
        const application = await ScholarshipApplication.create({
            student: req.user._id,
            profile: profile._id,
            currentStatus: 'Submitted',
            verificationStage: 'Verifier',
            applicationType: 'Renewal',
            applicationYear: currentYear
        });

        // Handle Documents
        if (req.files) {
            console.log('📄 [RENEW] Processing uploaded documents...');
            console.log('Files received:', Object.keys(req.files));

            const documentPromises = [];
            const docTypeMap = {
                'aadhar': 'Aadhar Card',
                'caste': 'Caste Certificate',
                'income': 'Income Certificate',
                'bankPassbook': 'Bank Passbook',
                'marksheet': 'Academic Marksheet'
            };

            Object.keys(req.files).forEach(field => {
                const files = req.files[field];
                console.log(`Processing ${field}: ${files.length} file(s)`);

                files.forEach(file => {
                    const docType = docTypeMap[field] || 'General Document';
                    console.log(`Creating document record: ${docType} -> ${file.filename}`);

                    documentPromises.push(
                        Document.create({
                            applicationId: application._id,
                            documentType: docType,
                            fileUrl: `/uploads/${file.filename}`,
                            verificationStatus: 'Pending'
                        }).then(doc => {
                            console.log(`✅ Document saved: ${doc.documentType} (ID: ${doc._id})`);
                            return doc;
                        }).catch(err => {
                            console.error(`❌ Failed to save ${docType}:`, err.message);
                            throw err;
                        })
                    );
                });
            });

            const savedDocs = await Promise.all(documentPromises);
            console.log(`📊 [RENEW] Total documents saved: ${savedDocs.length}`)
        } else {
            console.log('⚠️  [RENEW] No files uploaded');
        }

        res.status(201).json(application);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const withdrawFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const withdrawalAmount = Number(amount);

        const application = await ScholarshipApplication.findOne({ student: req.user._id }).sort({ createdAt: -1 });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.withdrawalStatus === 'Not Available' || application.withdrawalStatus === 'Fully Withdrawn') {
            return res.status(400).json({ message: 'Funds not available for withdrawal' });
        }

        const availableBalance = application.scholarshipAmount - (application.withdrawnAmount || 0);

        if (withdrawalAmount > availableBalance) {
            return res.status(400).json({ message: `Insufficient funds. Available: ${availableBalance}` });
        }

        application.withdrawnAmount = (application.withdrawnAmount || 0) + withdrawalAmount;

        if (application.withdrawnAmount >= application.scholarshipAmount) {
            application.withdrawalStatus = 'Fully Withdrawn';
        } else {
            application.withdrawalStatus = 'Partially Withdrawn';
        }

        await application.save();

        res.json({ message: `Successfully withdrawn ₹${withdrawalAmount}`, application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const resetApplication = async (req, res) => {
    try {
        const application = await ScholarshipApplication.findOneAndDelete({ student: req.user._id });
        if (application) {
            // Optionally delete documents too
            await Document.deleteMany({ applicationId: application._id });
            // Optionally delete/reset profile? user might want to keep profile.
            // Let's keep profile, or maybe delete it to let them start fresh?
            // "Enter personal details" implies they want to enter profile again.
            await StudentProfile.findByIdAndDelete(application.profile);

            res.json({ message: 'Application reset successfully' });
        } else {
            res.status(404).json({ message: 'No application found to reset' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Create a new grievance/helpdesk ticket
// @route   POST /api/student/grievance
// @access  Private (Student)
const createGrievance = async (req, res) => {
    try {
        const { subject, description, type } = req.body;

        console.log('--- Create Grievance Request ---');
        console.log('User:', req.user._id);
        console.log('Body:', req.body);

        if (!subject || !description || !type) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const grievance = await Grievance.create({
            studentId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            subject,
            description,
            type,
            status: 'Open'
        });

        res.status(201).json(grievance);
    } catch (error) {
        console.error("Error creating grievance:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all grievances for the logged-in student
// @route   GET /api/student/grievance/my
// @access  Private (Student)
const getMyGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({ studentId: req.user._id }).sort({ createdAt: -1 });
        res.json(grievances);
    } catch (error) {
        console.error("Error fetching grievances:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    submitApplication,
    getApplicationStatus,
    resubmitApplication,
    renewApplication,
    withdrawFunds,
    resetApplication,
    createGrievance,
    getMyGrievances
};
