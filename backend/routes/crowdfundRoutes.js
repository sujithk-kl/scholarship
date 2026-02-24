const express = require('express');
const router = express.Router();
const {
    getCampaigns,
    getCampaignById,
    createCampaign,
    donateToCampaign,
    getMyCampaigns,
    getCrowdfundStats,
    getFundedCampaigns
} = require('../controllers/crowdfundController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/campaigns', getCampaigns);
router.get('/stats', getCrowdfundStats);
router.get('/funded', getFundedCampaigns);
router.get('/campaign/:id', getCampaignById);
router.post('/donate/:id', donateToCampaign);

// Protected routes
router.post('/campaign', protect, authorize('Student', 'Admin'), createCampaign);
router.get('/my', protect, authorize('Student'), getMyCampaigns);

module.exports = router;
