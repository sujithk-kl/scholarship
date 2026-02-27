const ScholarshipScheme = require('../models/ScholarshipScheme');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const { generateResponse } = require('../services/aiService');

// @desc    Handle AI Chat queries
// @route   POST /api/chat
// @access  Public (Enhanced if Authenticated)
const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;

        // Gather Context
        let contextParts = [];

        // 1. Active Schemes
        const schemes = await ScholarshipScheme.find({ isActive: true }).lean();
        if (schemes.length > 0) {
            const schemeList = schemes.map(s => `- ${s.name} (Deadline: ${new Date(s.deadline).toLocaleDateString()})`).join('\n');
            contextParts.push(`Active Scholarships:\n${schemeList}`);
        } else {
            contextParts.push("Active Scholarships: None currently active.");
        }

        // 2. Default Documents
        contextParts.push("Required Documents typically include: Aadhaar Card, Income Certificate, Previous Year Marksheet, and Domicile Certificate.");

        // 3. User Application Status
        if (userId) {
            const application = await ScholarshipApplication.findOne({ student: userId }).sort({ createdAt: -1 }).lean();
            if (application) {
                contextParts.push(`Current User's Latest Application Status: ${application.currentStatus} (Application ID: ${application._id.toString().substring(0, 8)})`);
            } else {
                contextParts.push("Current User's Latest Application Status: No active applications found.");
            }
        }

        const systemInstruction = `You are CampusAI, a helpful, friendly, and concise assistant for a scholarship portal.
Your goal is to answer questions about scholarships, deadlines, and application statuses.
Format your responses using Markdown (e.g., use bullet points, bold text).
Keep your answers brief, professional, and directly related to the user's query.
If the user's query is not related to scholarships, education, or portal navigation, politely redirect them.
Do NOT invent information that is not aligned with the provided context.

Context Data:
${contextParts.join('\n\n')}
`;

        const reply = await generateResponse(message, systemInstruction);

        res.json({ reply });
    } catch (error) {
        console.error("AI Chat Error Stack:", error.stack || error);
        console.error("AI Chat Error Details:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: 'AI Service currently busy. Please try again later.', error: error.message });
    }
};

module.exports = { handleChat };
