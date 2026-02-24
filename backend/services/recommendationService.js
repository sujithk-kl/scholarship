const ScholarshipScheme = require('../models/ScholarshipScheme');

/**
 * AI Scholarship Recommendation Engine
 * Matches student profiles against active scholarship schemes using weighted scoring.
 * 
 * Weights:
 *   - Income match:    30%
 *   - Marks match:     25%
 *   - Category match:  25%
 *   - Location match:  10%
 *   - Interest/Tag:    10%
 */
const getRecommendations = async (profile) => {
    const schemes = await ScholarshipScheme.find({ isActive: true });

    if (!profile) return [];

    const income = profile.financialDetails?.annualIncome || 0;
    const marks = profile.academicDetails?.previousYearPercentage || 0;
    const category = profile.personalDetails?.casteCategory || '';
    const state = profile.personalDetails?.state || '';
    const course = (profile.academicDetails?.course || '').toLowerCase();

    const scored = schemes.map(scheme => {
        let matchScore = 0;
        const breakdown = {};

        // --- 1. Income Match (30%) ---
        if (scheme.incomeCap && scheme.incomeCap > 0) {
            if (income <= scheme.incomeCap) {
                // Lower income gets higher score
                const ratio = 1 - (income / scheme.incomeCap);
                breakdown.income = Math.round(ratio * 30);
            } else {
                breakdown.income = 0;
            }
        } else {
            breakdown.income = 30; // No cap = everyone qualifies
        }

        // --- 2. Marks Match (25%) ---
        if (scheme.minMarks && scheme.minMarks > 0) {
            if (marks >= scheme.minMarks) {
                // Higher marks get higher score
                const ratio = Math.min(marks / 100, 1);
                breakdown.marks = Math.round(ratio * 25);
            } else {
                breakdown.marks = 0;
            }
        } else {
            breakdown.marks = 25;
        }

        // --- 3. Category Match (25%) ---
        if (scheme.eligibleCategories && scheme.eligibleCategories.length > 0) {
            if (scheme.eligibleCategories.includes(category)) {
                breakdown.category = 25;
            } else {
                breakdown.category = 0;
            }
        } else {
            breakdown.category = 25; // No restriction
        }

        // --- 4. Location Match (10%) ---
        if (scheme.eligibleStates && scheme.eligibleStates.length > 0) {
            if (scheme.eligibleStates.includes(state)) {
                breakdown.location = 10;
            } else {
                breakdown.location = 0;
            }
        } else {
            breakdown.location = 10; // National scheme
        }

        // --- 5. Interest / Tag Match (10%) ---
        if (scheme.tags && scheme.tags.length > 0) {
            const courseMatch = scheme.tags.some(tag =>
                course.includes(tag.toLowerCase()) || tag.toLowerCase().includes(course)
            );
            breakdown.tags = courseMatch ? 10 : 2; // Partial credit if no match
        } else {
            breakdown.tags = 10;
        }

        matchScore = breakdown.income + breakdown.marks + breakdown.category + breakdown.location + breakdown.tags;

        return {
            _id: scheme._id,
            name: scheme.name,
            description: scheme.description,
            amount: scheme.amount,
            deadline: scheme.deadline,
            eligibility: scheme.eligibility,
            tags: scheme.tags,
            matchScore,
            breakdown
        };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return scored;
};

module.exports = { getRecommendations };
