const CrowdfundCampaign = require('../models/CrowdfundCampaign');

/**
 * @desc    Get all active crowdfund campaigns
 * @route   GET /api/crowdfund/campaigns
 * @access  Public
 */
const getCampaigns = async (req, res) => {
    try {
        const campaigns = await CrowdfundCampaign.find({ status: 'Active' })
            .populate('student', 'name email')
            .sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get single campaign details
 * @route   GET /api/crowdfund/campaign/:id
 * @access  Public
 */
const getCampaignById = async (req, res) => {
    try {
        const campaign = await CrowdfundCampaign.findById(req.params.id)
            .populate('student', 'name email');
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Create a crowdfunding campaign (for not-eligible students)
 * @route   POST /api/crowdfund/campaign
 * @access  Private (Student)
 */
const createCampaign = async (req, res) => {
    try {
        const { title, story, goalAmount, courseName, instituteName, category } = req.body;

        if (!title || !story || !goalAmount) {
            return res.status(400).json({ message: 'Title, story, and goal amount are required.' });
        }

        const isAdmin = req.user.role === 'Admin';

        // Check if student already has an active campaign (Students only)
        if (!isAdmin) {
            const existing = await CrowdfundCampaign.findOne({
                student: req.user._id,
                status: 'Active'
            });
            if (existing) {
                return res.status(400).json({ message: 'You already have an active campaign.' });
            }
        }

        const campaign = await CrowdfundCampaign.create({
            student: req.user._id,
            title,
            story,
            goalAmount: Number(goalAmount),
            courseName,
            instituteName,
            category: category || 'Education',
            isOfficial: isAdmin,
            createdByRole: req.user.role
        });

        res.status(201).json(campaign);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Donate to a campaign
 * @route   POST /api/crowdfund/donate/:id
 * @access  Public
 */
const donateToCampaign = async (req, res) => {
    try {
        const { name, email, amount, isAnonymous, message } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Please enter a valid donation amount.' });
        }

        const campaign = await CrowdfundCampaign.findById(req.params.id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        if (campaign.status !== 'Active') {
            return res.status(400).json({ message: 'This campaign is no longer accepting donations.' });
        }

        const donationAmount = Number(amount);

        campaign.donors.push({
            name: isAnonymous ? 'Anonymous' : (name || 'Anonymous'),
            email,
            amount: donationAmount,
            isAnonymous: isAnonymous || false,
            message
        });

        campaign.raisedAmount += donationAmount;

        // Auto-mark as Funded if goal reached
        if (campaign.raisedAmount >= campaign.goalAmount) {
            campaign.status = 'Funded';
        }

        await campaign.save();

        // Real-time notification to the student owner
        if (req.io) {
            req.io.to(campaign.student.toString()).emit('status_update', `New donation of ₹${donationAmount} received!`);
        }

        res.json({
            message: `Thank you for your donation of ₹${donationAmount}!`,
            campaign
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get my campaigns (for logged-in student)
 * @route   GET /api/crowdfund/my
 * @access  Private (Student)
 */
const getMyCampaigns = async (req, res) => {
    try {
        const campaigns = await CrowdfundCampaign.find({ student: req.user._id })
            .sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get crowdfunding global stats
 * @route   GET /api/crowdfund/stats
 * @access  Public
 */
const getCrowdfundStats = async (req, res) => {
    try {
        const allCampaigns = await CrowdfundCampaign.find({});

        const stats = {
            totalActive: allCampaigns.filter(c => c.status === 'Active').length,
            totalRaised: allCampaigns.reduce((sum, c) => sum + (c.raisedAmount || 0), 0),
            totalDonors: allCampaigns.reduce((sum, c) => sum + (c.donors?.length || 0), 0)
        };

        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get recently funded campaigns
 * @route   GET /api/crowdfund/funded
 * @access  Public
 */
const getFundedCampaigns = async (req, res) => {
    try {
        const campaigns = await CrowdfundCampaign.find({ status: 'Funded' })
            .populate('student', 'name')
            .sort({ updatedAt: -1 })
            .limit(6);
        res.json(campaigns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCampaigns,
    getCampaignById,
    createCampaign,
    donateToCampaign,
    getMyCampaigns,
    getCrowdfundStats,
    getFundedCampaigns
};
