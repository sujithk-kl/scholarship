const { GoogleGenerativeAI } = require('@google/generative-ai');

const initGenerativeAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn("WARNING: GEMINI_API_KEY is missing or not configured in .env");
    }
    return new GoogleGenerativeAI(apiKey);
};

const generateResponse = async (prompt, systemInstruction = "") => {
    try {
        const genAI = initGenerativeAI();
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction,
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error;
    }
};

module.exports = { generateResponse };
