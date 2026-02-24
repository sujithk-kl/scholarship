const express = require('express');
const router = express.Router();
const { getSummaryStats, getDistrictStats, getMonthlyTrends } = require('../controllers/analyticsController');
// Assume protect and admin middleware exist or create mock for now if needed.
// Based on server.js logs, auth is used.
// Let's assume there's a middleware folder.

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/summary', protect, authorize('Admin'), getSummaryStats);
router.get('/district', protect, authorize('Admin'), getDistrictStats);
router.get('/monthly', protect, authorize('Admin'), getMonthlyTrends);

module.exports = router;
