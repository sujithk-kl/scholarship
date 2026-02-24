const StudentProfile = require('../models/StudentProfile');

/**
 * @desc    Simulate policy changes on existing student data
 * @route   POST /api/admin/simulate
 * @access  Private (Admin)
 */
const simulatePolicy = async (req, res) => {
    try {
        const { incomeLimit, minMarks, categories, avgAmount } = req.body;

        // Default constraints if not provided
        const limit = Number(incomeLimit) || 250000;
        const marks = Number(minMarks) || 60;
        const targetCategories = categories && Array.isArray(categories) ? categories : ['SC', 'ST', 'OBC'];
        const scholarshipAmount = Number(avgAmount) || 50000;

        // Fetch all profiles for simulation
        const allProfiles = await StudentProfile.find({});

        // Simulation results
        let currentEligibleCount = 0;
        let simulatedEligibleCount = 0;

        // Baseline (Current Policy: <2.5L, >60%, [SC, ST, OBC])
        const baselineIncome = 250000;
        const baselineMarks = 60;
        const baselineCategories = ['SC', 'ST', 'OBC'];

        allProfiles.forEach(profile => {
            const pIncome = profile.financialDetails?.annualIncome || 0;
            const pMarks = profile.academicDetails?.previousYearPercentage || 0;
            const pCategory = profile.personalDetails?.casteCategory || '';

            // Check Baseline
            if (pIncome < baselineIncome && pMarks > baselineMarks && baselineCategories.includes(pCategory)) {
                currentEligibleCount++;
            }

            // Check Simulated
            if (pIncome <= limit && pMarks >= marks && targetCategories.includes(pCategory)) {
                simulatedEligibleCount++;
            }
        });

        res.json({
            summary: {
                totalStudents: allProfiles.length,
                currentEligible: currentEligibleCount,
                simulatedEligible: simulatedEligibleCount,
                difference: simulatedEligibleCount - currentEligibleCount
            },
            financials: {
                currentBudget: currentEligibleCount * scholarshipAmount,
                simulatedBudget: simulatedEligibleCount * scholarshipAmount,
                budgetImpact: (simulatedEligibleCount - currentEligibleCount) * scholarshipAmount
            },
            parameters: {
                incomeLimit: limit,
                minMarks: marks,
                categories: targetCategories
            }
        });

    } catch (error) {
        console.error('Simulation Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { simulatePolicy };
