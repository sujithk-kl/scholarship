const checkEligibility = (profile) => {
    if (!profile || !profile.financialDetails || !profile.academicDetails) {
        return 'Not Eligible';
    }

    const income = profile.financialDetails.annualIncome;
    const percentage = profile.academicDetails.previousYearPercentage;
    const caste = profile.personalDetails.casteCategory;

    // Criteria: Income < 2,50,000 AND Marks > 60% AND Category in [SC, ST, OBC]
    const incomeLimit = 250000;
    const marksLimit = 60;
    const validCategories = ['SC', 'ST', 'OBC'];

    if (income < incomeLimit && percentage > marksLimit && validCategories.includes(caste)) {
        return 'Eligible';
    }

    return 'Not Eligible';
};

module.exports = { checkEligibility };
