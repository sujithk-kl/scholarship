const ScholarshipScheme = require('../models/ScholarshipScheme');
const ScholarshipApplication = require('../models/ScholarshipApplication');

// @desc    Handle AI Chat queries
// @route   POST /api/chat
// @access  Public (Enhanced if Authenticated)
const handleChat = async (req, res) => {
    try {
        const { message, userId } = req.body;
        const msg = message.toLowerCase().trim();
        let reply = "";

        // 0. Greetings
        if (msg === 'hi' || msg === 'hello' || msg === 'hey' || msg === 'greeting') {
            reply = "Hello there! 👋 I'm CampusAI, your scholarship assistant. How can I help you today?";
        }

        // 1. Check for Scholarship Schemes
        else if (msg.includes('scheme') || msg.includes('scholarship') || msg.includes('available')) {
            const schemes = await ScholarshipScheme.find({ isActive: true }).limit(3);
            if (schemes.length > 0) {
                reply = `We have several active scholarships like ${schemes.map(s => s.name).join(', ')}. Which one would you like to know more about?`;
            } else {
                reply = "Currently, there are no active schemes. Please check back later or explore our Crowdfunding section.";
            }
        }

        // 2. Check for Dates/Deadlines
        else if (msg.includes('date') || msg.includes('deadline') || msg.includes('last day')) {
            const schemes = await ScholarshipScheme.find({ isActive: true }).sort({ deadline: 1 }).limit(1);
            if (schemes.length > 0) {
                reply = `The nearest deadline is for "${schemes[0].name}" on ${new Date(schemes[0].deadline).toLocaleDateString()}. Make sure to apply soon!`;
            } else {
                reply = "The general deadline for most scholarships is March 31st, 2026.";
            }
        }

        // 3. Check for Documents
        else if (msg.includes('document') || msg.includes('need') || msg.includes('require')) {
            reply = "To apply, you typically need: 1. Aadhaar Card, 2. Income Certificate, 3. Previous Year Marksheet, and 4. Domicile Certificate. Specific schemes may required additional documents.";
        }

        // 4. Check for User Status (if userId provided)
        else if ((msg.includes('status') || msg.includes('my application')) && userId) {
            const application = await ScholarshipApplication.findOne({ student: userId }).sort({ createdAt: -1 });
            if (application) {
                reply = `Your latest application (ID: ${application._id.toString().substring(0, 8)}) is currently at the "${application.currentStatus}" stage.`;
            } else {
                reply = "I couldn't find any active applications for your account. You can start applying from the 'Schemes' section.";
            }
        }

        // 5. General Help / Default
        else {
            reply = "I'm specialized in scholarship queries. You can ask me about: \n- Available schemes\n- Important dates\n- Required documents\n- Your application status";
        }

        res.json({ reply });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ message: 'AI Service currently busy. Please try again later.' });
    }
};

module.exports = { handleChat };
