const express = require('express');
const router = express.Router();
const { simulatePolicy } = require('../controllers/simulationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/simulate', protect, authorize('Admin'), simulatePolicy);

module.exports = router;
