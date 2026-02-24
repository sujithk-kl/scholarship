const express = require('express');
const {
    submitApplication,
    getApplicationStatus,
    resubmitApplication,
    withdrawFunds,
    renewApplication,
    resetApplication,
    createGrievance,
    getMyGrievances
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { trackBehavior } = require('../middleware/securityMiddleware');
const upload = require('../utils/uploadFile');

const router = express.Router();

router.use(protect);
router.use(trackBehavior);

const uploadFields = upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'caste', maxCount: 1 },
    { name: 'income', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'marksheet', maxCount: 1 }
]);

router.post('/submit', authorize('Student', 'Verifier'), uploadFields, submitApplication);
router.post('/resubmit', authorize('Student', 'Verifier'), uploadFields, resubmitApplication);
router.get('/status', authorize('Student', 'Verifier'), getApplicationStatus);
router.post('/renew', authorize('Student', 'Verifier'), uploadFields, renewApplication);
router.post('/withdraw', authorize('Student', 'Verifier'), withdrawFunds);
router.delete('/reset', authorize('Student', 'Verifier'), resetApplication);
router.put('/reupload/:id', authorize('Student'), upload.single('document'), require('../controllers/documentController').reuploadDocument);

// AI Scholarship Recommendations
const { getStudentRecommendations } = require('../controllers/recommendationController');
router.get('/recommendations', authorize('Student', 'Verifier'), getStudentRecommendations);

// Grievance / Helpdesk
router.post('/grievance', authorize('Student'), createGrievance);
router.get('/grievance/my', authorize('Student'), getMyGrievances);

module.exports = router;
