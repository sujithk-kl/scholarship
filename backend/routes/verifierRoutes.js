const express = require('express');
const {
    getApplications,
    getApplicationById,
    verifyDocument,
    raiseQuery,
    forwardToAdmin,
    aiVerifyApplication
} = require('../controllers/verifierController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/applications', protect, authorize('Verifier'), getApplications);
router.get('/application/:id', protect, authorize('Verifier'), getApplicationById);
router.put('/document/:id/verify', protect, authorize('Verifier'), verifyDocument);
router.post('/query', protect, authorize('Verifier'), raiseQuery);
router.put('/application/:id/forward', protect, authorize('Verifier'), forwardToAdmin);
router.post('/application/:id/ai-verify', protect, authorize('Verifier', 'Admin'), aiVerifyApplication);

module.exports = router;
