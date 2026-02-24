const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config for Grievance Attachments
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/grievance/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post('/create', protect, authorize('Student', 'Admin', 'Verifier'), upload.single('attachment'), createComplaint);
router.get('/my', protect, authorize('Student', 'Admin', 'Verifier'), getMyComplaints);
router.get('/admin/list', protect, authorize('Admin', 'Verifier'), getAllComplaints);
router.put('/admin/update/:id', protect, authorize('Admin', 'Verifier'), updateComplaint);

module.exports = router;
