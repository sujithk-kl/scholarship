const calculateAIScore = (application, documents) => {
    // Simulated OCR Extraction Logic
    // In a real app, we would use Tesseract.js or AWS Textract here.

    let fraudPoints = 0;
    const studentName = application.student?.name?.toLowerCase() || "";
    const applicationIncome = application.profile?.financialDetails?.annualIncome || 0;
    const applicationCommunity = application.profile?.personalDetails?.caste?.toLowerCase() || "";

    // Simulation: We assume documents contain some text
    // If documents are missing, that's a red flag
    if (!documents || documents.length === 0) return 95; // High fraud score

    documents.forEach(doc => {
        // Simulate text extraction based on document type
        let extractedText = "";

        // Logic to simulate "Fake" vs "Real" documents for demo purposes
        // If the student name is "Test User", we'll simulate a mismatch
        if (studentName.includes("test")) {
            extractedText = "Name: John Doe, Income: 500000, Community: General";
        } else {
            extractedText = `Name: ${studentName}, Income: ${applicationIncome}, Community: ${applicationCommunity}`;
        }

        extractedText = extractedText.toLowerCase();

        // 1. Name Check
        if (!extractedText.includes(studentName)) {
            fraudPoints += 40;
        }

        // 2. Income Check (Simulate approximate matching)
        if (doc.documentType === 'Income Certificate') {
            if (!extractedText.includes(applicationIncome.toString())) {
                fraudPoints += 30;
            }
        }

        // 3. Community Check
        if (doc.documentType === 'Caste Certificate') {
            if (!extractedText.includes(applicationCommunity)) {
                fraudPoints += 20;
            }
        }
    });

    // Ensure score is between 0 and 100
    return Math.min(fraudPoints, 100);
};

const verifyDocuments = async (application, documents) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const score = calculateAIScore(application, documents);
            resolve(score);
        }, 2000); // Simulate 2s intensive AI processing
    });
};

module.exports = { verifyDocuments };
