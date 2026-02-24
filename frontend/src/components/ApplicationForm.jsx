import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ApplicationForm = ({ onSuccess, initialData = null, isResubmission = false, isRenewal = false }) => {
    const { user } = useContext(AuthContext);
    const [documents, setDocuments] = useState({});
    const [formData, setFormData] = useState(initialData || {
        personalDetails: {
            phone: user?.mobile || '',
            // Initialize other fields if needed
        },
        academicDetails: {},
        financialDetails: {}
    });

    const checkCurrentEligibility = () => {
        const income = Number(formData.financialDetails.annualIncome) || 0;
        const percentage = Number(formData.academicDetails.previousYearPercentage) || 0;
        const caste = formData.personalDetails.casteCategory;

        const criteria = {
            income: income < 250000,
            marks: percentage > 60,
            community: ['SC', 'ST', 'OBC'].includes(caste)
        };

        const isEligible = criteria.income && criteria.marks && criteria.community;

        return { isEligible, criteria };
    };

    const eligibility = checkCurrentEligibility();

    const [activeTab, setActiveTab] = useState(0);
    const tabs = ['Document upload', 'Personal Information', 'Other Information', 'Current Course', 'Past Qualification', 'Apply Scholarship'];

    const handleNextTab = () => {
        if (activeTab < tabs.length - 1) {
            setActiveTab(prev => prev + 1);
            // Optional: Scroll to top
            window.scrollTo(0, 0);
        }
    };

    // Auto-fill effect when user data is available
    useEffect(() => {
        if (user && !initialData) {
            setFormData(prev => ({
                ...prev,
                personalDetails: {
                    ...prev.personalDetails,
                    email: user.email,
                    fullName: user.name,
                    phone: user.mobile || prev.personalDetails.phone,
                }
            }));
        }
    }, [user, initialData]);

    const handleChange = (section, e) => {
        setFormData({
            ...formData,
            [section]: { ...formData[section], [e.target.name]: e.target.value }
        });
    };

    const handleFileChange = (type, e) => {
        if (e.target.files && e.target.files[0]) {
            setDocuments({ ...documents, [type]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('personalDetails', JSON.stringify(formData.personalDetails));
        data.append('academicDetails', JSON.stringify(formData.academicDetails));
        data.append('financialDetails', JSON.stringify(formData.financialDetails));

        // Append all documents
        console.log('📎 Preparing to upload documents:', Object.keys(documents));
        let fileCount = 0;

        if (documents.aadhar) {
            data.append('aadhar', documents.aadhar);
            console.log('✓ Attached Aadhaar:', documents.aadhar.name);
            fileCount++;
        }
        if (documents.caste) {
            data.append('caste', documents.caste);
            console.log('✓ Attached Caste:', documents.caste.name);
            fileCount++;
        }
        if (documents.income) {
            data.append('income', documents.income);
            console.log('✓ Attached Income:', documents.income.name);
            fileCount++;
        }
        if (documents.bankPassbook) {
            data.append('bankPassbook', documents.bankPassbook);
            console.log('✓ Attached Bank Passbook:', documents.bankPassbook.name);
            fileCount++;
        }
        if (documents.marksheet) {
            data.append('marksheet', documents.marksheet);
            console.log('✓ Attached Marksheet:', documents.marksheet.name);
            fileCount++;
        }

        // Also support generic 'documents' if needed
        Object.keys(documents).forEach(key => {
            if (!['aadhar', 'caste', 'income', 'bankPassbook', 'marksheet'].includes(key)) {
                data.append(key, documents[key]);
                console.log('✓ Attached', key + ':', documents[key].name);
                fileCount++;
            }
        });

        console.log(`📊 Total files to upload: ${fileCount}`);

        try {
            const endpoint = isResubmission ? '/student/resubmit' : isRenewal ? '/student/renew' : '/student/submit';
            console.log('🚀 Submitting to:', endpoint);

            // IMPORTANT: Don't set Content-Type header manually for FormData
            // The browser will set it automatically with the correct boundary
            await api.post(endpoint, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('✅ Application submitted successfully!');
            onSuccess();
        } catch (error) {
            console.error('❌ Submission error:', error);
            alert(error.response?.data?.message || 'Submission Failed');
        }
    };

    if (!formData.personalDetails || !formData.academicDetails || !formData.financialDetails) {
        return <div className="p-8 text-center">Loading Application Form...</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden min-h-[600px] flex flex-col">
            {/* Header / Title */}
            <div className="bg-yellow-400 p-4">
                <h1 className="text-xl font-bold text-gray-800">Smart Scholarship Portal - Scholarship Application</h1>
            </div>

            <div className="p-8 flex-1 overflow-y-auto">


                {/* Real-time Eligibility Banner */}
                <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border-l-4 transition-all duration-500 ${eligibility.isEligible
                    ? 'bg-green-50 border-green-500 text-green-800'
                    : 'bg-red-50 border-red-500 text-red-800'
                    }`}>
                    <div className="mt-1">
                        {eligibility.isEligible
                            ? <CheckCircle size={20} className="text-green-600" />
                            : <AlertCircle size={20} className="text-red-600" />
                        }
                    </div>
                    <div>
                        <p className="font-bold text-sm">
                            Real-time Eligibility Check: {eligibility.isEligible ? 'Eligible for Scholarship' : 'Check Requirements'}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className={`text-xs ${eligibility.criteria.income ? 'text-green-600' : 'text-red-600'}`}>
                                ● Income &lt; 2.5L ({eligibility.criteria.income ? 'Passed' : 'Pending'})
                            </span>
                            <span className={`text-xs ${eligibility.criteria.marks ? 'text-green-600' : 'text-red-600'}`}>
                                ● Marks &gt; 60% ({eligibility.criteria.marks ? 'Passed' : 'Pending'})
                            </span>
                            <span className={`text-xs ${eligibility.criteria.community ? 'text-green-600' : 'text-red-600'}`}>
                                ● Category SC/ST/OBC ({eligibility.criteria.community ? 'Passed' : 'Pending'})
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Document Upload (Tab 0) */}
                    {activeTab === 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Upload Aadhar Card</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Card</label>
                                    <input type="file" onChange={(e) => handleFileChange('aadhar', e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                                </div>
                                <button type="button" onClick={handleNextTab} className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-sm">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 2: Personal Information (Tab 1) */}
                    {activeTab === 1 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Personal Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Email</label>
                                    <input name="email" value={formData.personalDetails.email || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm text-gray-800 outline-none" placeholder="Enter Email Address" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                                    <input name="fullName" value={formData.personalDetails.fullName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm text-gray-800 outline-none" placeholder="Enter Full Name" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Aadhaar Number</label>
                                    <input name="aadhaarNumber" value={formData.personalDetails.aadhaarNumber || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="XXXX-XXXX-XXXX" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Mobile Number</label>
                                    <input name="phone" value={formData.personalDetails.phone || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="Mobile Number" required />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Date of Birth</label>
                                    <input type="date" name="dob" value={formData.personalDetails.dob ? formData.personalDetails.dob.split('T')[0] : ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Gender</label>
                                    <select name="gender" value={formData.personalDetails.gender || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none">
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Father's Full Name</label>
                                    <input name="fatherName" value={formData.personalDetails.fatherName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none uppercase" placeholder="Enter Father's Name" required />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Mother's Full Name</label>
                                    <input name="motherName" value={formData.personalDetails.motherName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none uppercase" placeholder="Enter Mother's Name" required />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-1">Address</label>
                                <textarea name="address" value={formData.personalDetails.address || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" rows="2" placeholder="Enter Permanent Address"></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">State</label>
                                    <input name="state" value={formData.personalDetails.state || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="State" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">District</label>
                                    <input name="district" value={formData.personalDetails.district || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="District" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Taluka</label>
                                    <input name="taluka" value={formData.personalDetails.taluka || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="Taluka" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Pin Code</label>
                                    <input name="pincode" value={formData.personalDetails.pincode || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="Pin Code" />
                                </div>
                            </div>

                            <button type="button" onClick={handleNextTab} className="mt-4 bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-sm">
                                Next
                            </button>
                        </div>
                    )}

                    {/* Section 3: Other Information (Tab 2) - Merging Caste & Domicile here or keeping separate? 
                       The tabs list is: Document upload, Personal Info, Other Info, Current Course, Past Qual, Apply Scholarship. 
                       I will map Caste/Domicile/Income to 'Other Information' for now, or split roughly.
                    */}
                    {activeTab === 2 && (
                        <div className="space-y-6">
                            {/* Caste Details */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-md font-bold mb-4 text-gray-700">Caste Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm mb-1">Caste Category</label>
                                        <select name="casteCategory" value={formData.personalDetails.casteCategory || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none">
                                            <option value="">Select Category</option>
                                            <option value="General">General</option>
                                            <option value="OBC">OBC</option>
                                            <option value="SC">SC</option>
                                            <option value="ST">ST</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-600 text-sm mb-1">Caste</label>
                                        <input name="caste" value={formData.personalDetails.caste || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full bg-gray-100 border p-2 rounded text-sm outline-none" placeholder="Enter Caste" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Caste Certificate</label>
                                        <input type="file" onChange={(e) => handleFileChange('caste', e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Domicile */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Domicile Information</h2>
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">Are you a domicile of Tamil Nadu?</p>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2"><input type="radio" name="isDomicile" /> Yes</label>
                                            <label className="flex items-center gap-2"><input type="radio" name="isDomicile" /> No</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Income */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Income Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm mb-1">Family Annual Income (₹)</label>
                                        <input
                                            name="annualIncome"
                                            type="number"
                                            value={formData.financialDetails.annualIncome || ''}
                                            onChange={(e) => handleChange('financialDetails', e)}
                                            className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                            placeholder="Enter Annual Income"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Income Certificate</label>
                                            <input type="file" onChange={(e) => handleFileChange('income', e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="button" onClick={handleNextTab} className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-sm">
                                Next
                            </button>
                        </div>
                    )}

                    {/* Section 4: Current Course (Tab 3) - New Placeholder */}
                    {activeTab === 3 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Current Course Details</h2>
                            <p className="text-gray-500 text-sm">Course selection will be available here.</p>
                            <button type="button" onClick={handleNextTab} className="mt-4 bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-sm">
                                Next
                            </button>
                        </div>
                    )}

                    {/* Section 5: Past Qualification (Tab 4) */}
                    {activeTab === 4 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Past Qualification Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Previous Year Percentage (%)</label>
                                    <input
                                        name="previousYearPercentage"
                                        type="number"
                                        value={formData.academicDetails.previousYearPercentage || ''}
                                        onChange={(e) => handleChange('academicDetails', e)}
                                        className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-yellow-400 outline-none"
                                        placeholder="e.g. 85.5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Attendance Percentage</label>
                                    <input name="attendancePercentage" value={formData.academicDetails.attendancePercentage || ''} onChange={(e) => handleChange('academicDetails', e)} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-yellow-400 outline-none" placeholder="e.g. 90" required />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Marksheet</label>
                                    <input type="file" onChange={(e) => handleFileChange('marksheet', e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                                </div>
                                <button type="button" onClick={handleNextTab} className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded font-bold hover:bg-yellow-500 transition-colors shadow-sm text-sm">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Section 6: Apply Scholarship / Final Tab (Tab 5) - Bank Info + Submit */}
                    {activeTab === 5 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Bank Information & Submission</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">Bank Account No.</label>
                                    <input name="bankAccountNo" value={formData.financialDetails.bankAccountNo || ''} onChange={(e) => handleChange('financialDetails', e)} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-yellow-400 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-gray-600 text-sm mb-1">IFSC Code</label>
                                    <input name="ifscCode" value={formData.financialDetails.ifscCode || ''} onChange={(e) => handleChange('financialDetails', e)} className="w-full border p-2 rounded text-sm focus:ring-2 focus:ring-yellow-400 outline-none" required />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Bank Passbook</label>
                                    <input type="file" onChange={(e) => handleFileChange('bankPassbook', e)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                                </div>
                            </div>

                            <div className="text-center mt-8">
                                <button type="submit" className="bg-yellow-400 w-full text-yellow-900 px-10 py-3 rounded font-bold hover:bg-yellow-500 shadow-lg transform hover:-translate-y-1 transition-all">
                                    {isResubmission ? 'Resubmit Application' : isRenewal ? 'Submit Renewal' : 'Submit Application'}
                                </button>
                                <p className="text-xs text-gray-500 mt-2">Please review all information before submitting. You cannot edit after submission.</p>
                            </div>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
