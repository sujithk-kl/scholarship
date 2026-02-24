const express = require('express');
const {
    getAdminApplications,
    getAllApplications,
    approveApplication,
    rejectApplication,
    createAnnouncement,
    deleteAnnouncement,
    getAllAnnouncementsAdmin,
    createScheme,
    deleteScheme,
    getAllSchemesAdmin,
    getAllGrievances,
    updateGrievanceStatus,
    updateApplicationStatus
} = require('../controllers/adminController');
const { raiseQuery, getApplicationById } = require('../controllers/verifierController'); // Reuse logic
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/applications', protect, authorize('Admin'), getAdminApplications);
router.get('/all-applications', protect, authorize('Admin'), getAllApplications);
router.get('/application/:id', protect, authorize('Admin'), getApplicationById); // Reuse
router.put('/application/:id/approve', protect, authorize('Admin'), approveApplication);
router.put('/application/:id/reject', protect, authorize('Admin'), rejectApplication);
router.post('/query', protect, authorize('Admin'), raiseQuery); // Reuse

// Announcements
router.post('/announcement', protect, authorize('Admin'), createAnnouncement);
router.delete('/announcement/:id', protect, authorize('Admin'), deleteAnnouncement);
router.get('/announcements', protect, authorize('Admin'), getAllAnnouncementsAdmin);

// Schemes
router.post('/scheme', protect, authorize('Admin'), createScheme);
router.delete('/scheme/:id', protect, authorize('Admin'), deleteScheme);
router.get('/schemes', protect, authorize('Admin'), getAllSchemesAdmin);

// Grievances
router.get('/grievances', protect, authorize('Admin'), getAllGrievances);
router.put('/grievance/:id/status', protect, authorize('Admin'), updateGrievanceStatus);

// Generic Status Update
router.put('/application/:id/status', protect, authorize('Admin'), updateApplicationStatus);

// Document Expiry
router.get('/expired-documents', protect, authorize('Admin', 'Verifier'), require('../controllers/documentController').getExpiredDocuments);

module.exports = router;
