const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ScholarshipScheme = require('../models/ScholarshipScheme');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const schemes = [
    {
        name: "Merit-Cum-Means Scholarship for Professional and Technical Courses",
        description: "Financial assistance to the poor and meritorious students belonging to minority communities to enable them to pursue professional and technical courses.",
        amount: 25000,
        deadline: new Date("2026-12-31"),
        eligibility: "Minority students with >50% marks and family income < 2.5 Lakh per annum.",
        isActive: true,
        createdBy: "699330d9650a94262ac91fc3"
    },
    {
        name: "Post-Matric Scholarship for SC Students",
        description: "Scholastic support for students belonging to Scheduled Castes studying at post-matriculation or post-secondary stage to enable them to complete their education.",
        amount: 15000,
        deadline: new Date("2026-11-30"),
        eligibility: "SC students enrolled in post-matric courses with family income < 2.5 Lakh per annum.",
        isActive: true,
        createdBy: "699330d9650a94262ac91fc3"
    },
    {
        name: "Prime Minister's Scholarship Scheme for Central Armed Police Forces",
        description: "Encouraging higher technical and professional education for the dependent wards and widows of CAPFs & AR Personnel.",
        amount: 36000,
        deadline: new Date("2026-10-15"),
        eligibility: "Wards/widows of CAPFs & AR personnel pursuing professional degree courses.",
        isActive: true,
        createdBy: "699330d9650a94262ac91fc3"
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        await ScholarshipScheme.deleteMany({});
        console.log("Cleared existing schemes.");

        await ScholarshipScheme.insertMany(schemes);
        console.log("Successfully seeded 3 scholarship schemes!");

        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
