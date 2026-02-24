const express = require('express');
const router = express.Router();
const { getSecurityLogs, getSecurityStats, clearLogs } = require('../controllers/securityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('Admin'));

router.get('/logs', getSecurityLogs);
router.get('/stats', getSecurityStats);
router.delete('/logs', clearLogs);

module.exports = router;
