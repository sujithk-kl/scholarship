import { useState, useContext, useEffect } from 'react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const ApplicationForm = ({ onSuccess, initialData = null, isResubmission = false, isRenewal = false }) => {
    const { user } = useContext(AuthContext);
    const [documents, setDocuments] = useState({});
    const [formData, setFormData] = useState(initialData || {
        personalDetails: {
            phone: user?.mobile || '',
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
    const tabs = ['Identity Verification', 'Personal Profile', 'Demographics & Income', 'Academic History', 'Financial Routing'];

    const handleNextTab = () => {
        if (activeTab < tabs.length - 1) {
            setActiveTab(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handlePrevTab = () => {
        if (activeTab > 0) {
            setActiveTab(prev => prev - 1);
            window.scrollTo(0, 0);
        }
    };

    // Auto-fill effect when user data is available
    useEffect(() => {
        if (user && !initialData) {
            // eslint-disable-next-line
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

        if (documents.aadhar) data.append('aadhar', documents.aadhar);
        if (documents.caste) data.append('caste', documents.caste);
        if (documents.income) data.append('income', documents.income);
        if (documents.bankPassbook) data.append('bankPassbook', documents.bankPassbook);
        if (documents.marksheet) data.append('marksheet', documents.marksheet);

        Object.keys(documents).forEach(key => {
            if (!['aadhar', 'caste', 'income', 'bankPassbook', 'marksheet'].includes(key)) {
                data.append(key, documents[key]);
            }
        });

        try {
            const endpoint = isResubmission ? '/student/resubmit' : isRenewal ? '/student/renew' : '/student/submit';
            await api.post(endpoint, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onSuccess();
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.response?.data?.message || 'Submission Failed');
        }
    };

    if (!formData.personalDetails || !formData.academicDetails || !formData.financialDetails) {
        return <div className="p-8 text-center font-serif italic text-indigo-500">Initializing document sequence...</div>;
    }

    return (
        <div className="bg-white text-gray-900 font-sans flex flex-col md:flex-row min-h-[70vh] border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden ring-1 ring-black/5">

            {/* Sidebar Navigation (Vibrant Editorial) */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 p-8 md:p-10 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/80 flex flex-col relative overflow-hidden backdrop-blur-xl">
                {/* Decorative Blob */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/10 rounded-full filter blur-[60px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="mb-12 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-600/70 mb-2">Form Identifier</p>
                    <h2 className="font-serif text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-900 to-indigo-900">Application Dossier</h2>
                </div>

                <div className="flex-1 space-y-8 relative z-10">
                    {tabs.map((tab, idx) => (
                        <div key={idx} className="flex flex-col relative group">
                            <div className={`flex items-center gap-4 transition-all duration-300 ${activeTab === idx ? 'text-violet-800 scale-105 origin-left' : 'text-gray-400 hover:text-violet-500'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs shadow-sm transition-all ${activeTab === idx ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold ring-4 ring-violet-100' : 'bg-white font-medium border border-gray-200 group-hover:border-violet-300'}`}>0{idx + 1}</div>
                                <span className={`text-sm tracking-wide ${activeTab === idx ? 'font-bold' : 'font-medium'}`}>{tab}</span>
                            </div>
                            {/* Connector Line */}
                            {idx < tabs.length - 1 && (
                                <div className={`absolute left-4 top-8 bottom-[-24px] w-px transition-colors duration-500 ${activeTab > idx ? 'bg-violet-400' : 'bg-gray-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Eligibility Widget embedded in sidebar */}
                <div className="mt-12 relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-600/70 mb-3 block">System Predicament</p>
                    <div className={`rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all duration-500 ${eligibility.isEligible ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white scale-[1.02]' : 'bg-white border border-gray-100 text-gray-800'}`}>
                        {eligibility.isEligible && <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>}
                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            {eligibility.isEligible ? <CheckCircle size={18} className="text-white drop-shadow-md" /> : <AlertCircle size={18} className="text-amber-500" />}
                            <span className="font-serif text-sm font-medium">{eligibility.isEligible ? 'Eligible Status' : 'Pending Verification'}</span>
                        </div>
                        <ul className={`space-y-1.5 text-[10px] font-mono tracking-wide relative z-10 ${eligibility.isEligible ? 'text-emerald-50' : 'text-gray-500'}`}>
                            <li className="flex justify-between"><span>INC_CHK:</span> <span className="font-bold">{eligibility.criteria.income ? 'PASS' : 'PENDING'}</span></li>
                            <li className="flex justify-between"><span>ACA_CHK:</span> <span className="font-bold">{eligibility.criteria.marks ? 'PASS' : 'PENDING'}</span></li>
                            <li className="flex justify-between"><span>DEM_CHK:</span> <span className="font-bold">{eligibility.criteria.community ? 'PASS' : 'PENDING'}</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Main Form Area */}
            <div className="w-full md:w-2/3 p-8 md:p-14 relative bg-white">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1">

                        {/* Tab 1: Identity */}
                        {activeTab === 0 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 border-b border-gray-100 pb-6 flex items-end gap-4">
                                    <h3 className="font-serif text-4xl tracking-tight text-gray-900 leading-none">Identity Verification</h3>
                                    <span className="text-violet-600 font-mono font-bold text-sm bg-violet-50 px-2 py-1 rounded-md mb-1">01</span>
                                </div>
                                <div className="space-y-10">
                                    <div className="group">
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Aadhaar Identification Number</label>
                                        <input name="aadhaarNumber" value={formData.personalDetails.aadhaarNumber || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-3 text-2xl outline-none focus:border-violet-500 transition-colors bg-transparent placeholder-gray-300 font-medium text-gray-900 group-hover:border-violet-300" placeholder="XXXX XXXX XXXX" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 border-none p-0">Official Aadhaar Document</label>
                                        <div className="border border-dashed border-violet-200 bg-violet-50/30 rounded-3xl p-8 flex items-center justify-center hover:bg-violet-50 transition-colors cursor-pointer relative group">
                                            <input type="file" onChange={(e) => handleFileChange('aadhar', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-violet-700 group-hover:scale-105 transition-transform">{documents.aadhar ? documents.aadhar.name : 'Select PDF / Image'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 2: Personal Profile */}
                        {activeTab === 1 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 border-b border-gray-100 pb-6 flex items-end gap-4">
                                    <h3 className="font-serif text-4xl tracking-tight text-gray-900 leading-none">Personal Profile</h3>
                                    <span className="text-violet-600 font-mono font-bold text-sm bg-violet-50 px-2 py-1 rounded-md mb-1">02</span>
                                </div>
                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Full Legal Name</label>
                                            <input name="fullName" value={formData.personalDetails.fullName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent font-serif group-hover:border-violet-300 transition-colors" placeholder="John Doe" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Email Address</label>
                                            <input name="email" value={formData.personalDetails.email || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent font-serif group-hover:border-violet-300 transition-colors" placeholder="name@domain.com" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Mobile Number</label>
                                            <input name="phone" value={formData.personalDetails.phone || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent font-serif group-hover:border-violet-300 transition-colors" required />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Date of Birth</label>
                                            <input type="date" name="dob" value={formData.personalDetails.dob ? formData.personalDetails.dob.split('T')[0] : ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent font-serif text-gray-600 cursor-pointer group-hover:border-violet-300 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Gender</label>
                                            <select name="gender" value={formData.personalDetails.gender || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-lg outline-none focus:border-violet-500 bg-transparent text-gray-600 cursor-pointer group-hover:border-violet-300 transition-colors">
                                                <option value=""></option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Father's Name</label>
                                            <input name="fatherName" value={formData.personalDetails.fatherName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-lg outline-none focus:border-violet-500 bg-transparent uppercase group-hover:border-violet-300 transition-colors" required />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Mother's Name</label>
                                            <input name="motherName" value={formData.personalDetails.motherName || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-lg outline-none focus:border-violet-500 bg-transparent uppercase group-hover:border-violet-300 transition-colors" required />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Permanent Address</label>
                                        <textarea name="address" value={formData.personalDetails.address || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-lg outline-none focus:border-violet-500 bg-transparent group-hover:border-violet-300 transition-colors" rows="1" placeholder="Street, City, State..."></textarea>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                                        <div><input name="state" value={formData.personalDetails.state || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-violet-500 bg-transparent placeholder-gray-400 border-none p-0" placeholder="State/Region" /></div>
                                        <div><input name="district" value={formData.personalDetails.district || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-violet-500 bg-transparent placeholder-gray-400 border-none p-0" placeholder="District" /></div>
                                        <div><input name="taluka" value={formData.personalDetails.taluka || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-violet-500 bg-transparent placeholder-gray-400 border-none p-0" placeholder="Taluka" /></div>
                                        <div><input name="pincode" value={formData.personalDetails.pincode || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b border-gray-300 py-2 text-sm outline-none focus:border-violet-500 bg-transparent placeholder-gray-400 font-mono tracking-widest border-none p-0" placeholder="Postal Code" /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 3: Demographics & Income */}
                        {activeTab === 2 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 border-b border-gray-100 pb-6 flex items-end gap-4">
                                    <h3 className="font-serif text-4xl tracking-tight text-gray-900 leading-none">Demographics</h3>
                                    <span className="text-violet-600 font-mono font-bold text-sm bg-violet-50 px-2 py-1 rounded-md mb-1">03</span>
                                </div>
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Category</label>
                                            <select name="casteCategory" value={formData.personalDetails.casteCategory || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent cursor-pointer text-gray-800 group-hover:border-violet-300 transition-colors">
                                                <option value=""></option>
                                                <option value="General">General</option>
                                                <option value="OBC">OBC</option>
                                                <option value="SC">SC</option>
                                                <option value="ST">ST</option>
                                            </select>
                                        </div>
                                        <div className="group">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Specific Caste</label>
                                            <input name="caste" value={formData.personalDetails.caste || ''} onChange={(e) => handleChange('personalDetails', e)} className="w-full border-b-2 border-gray-200 py-2 text-xl outline-none focus:border-violet-500 bg-transparent font-serif group-hover:border-violet-300 transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 border-none p-0">Caste Certificate Document</label>
                                        <div className="border border-dashed border-violet-200 bg-violet-50/30 rounded-3xl p-6 flex items-center justify-center hover:bg-violet-50 transition-colors cursor-pointer relative group">
                                            <input type="file" onChange={(e) => handleFileChange('caste', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-violet-700 group-hover:scale-105 transition-transform">{documents.caste ? documents.caste.name : 'Select PDF / Image'}</span>
                                        </div>
                                    </div>

                                    <div className="pt-10 border-t border-gray-100 relative">
                                        <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full -translate-y-[1px]"></div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="group border-l-4 border-violet-500 pl-6 py-2 bg-gradient-to-r from-violet-50/50 to-transparent rounded-r-3xl">
                                                <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 transition-colors border-none p-0">Declared Annual Income (₹)</label>
                                                <input name="annualIncome" type="number" value={formData.financialDetails.annualIncome || ''} onChange={(e) => handleChange('financialDetails', e)} className="w-full border-none py-2 text-4xl font-serif text-violet-900 outline-none bg-transparent m-0 p-0" required />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 border-none p-0">Proof of Income Document</label>
                                        <div className="border border-dashed border-emerald-200 bg-emerald-50/30 rounded-3xl p-6 flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer relative group">
                                            <input type="file" onChange={(e) => handleFileChange('income', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-emerald-700 group-hover:scale-105 transition-transform">{documents.income ? documents.income.name : 'Select PDF / Image'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 4: Academic */}
                        {activeTab === 3 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 border-b border-gray-100 pb-6 flex items-end gap-4">
                                    <h3 className="font-serif text-4xl tracking-tight text-gray-900 leading-none">Academic History</h3>
                                    <span className="text-violet-600 font-mono font-bold text-sm bg-violet-50 px-2 py-1 rounded-md mb-1">04</span>
                                </div>
                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem]">
                                        <div className="group border-b border-slate-200 pb-4 md:border-b-0 md:pb-0 md:border-r md:pr-4">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 transition-colors border-none p-0">Previous Year Grade (%)</label>
                                            <input name="previousYearPercentage" type="number" value={formData.academicDetails.previousYearPercentage || ''} onChange={(e) => handleChange('academicDetails', e)} className="w-full border-none py-2 text-5xl font-serif outline-none bg-transparent text-slate-800 placeholder-slate-300 m-0 p-0" placeholder="0.0" required />
                                        </div>
                                        <div className="group pl-0 md:pl-4">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-slate-500 mb-2 transition-colors border-none p-0">Attendance Ratio (%)</label>
                                            <input name="attendancePercentage" type="number" value={formData.academicDetails.attendancePercentage || ''} onChange={(e) => handleChange('academicDetails', e)} className="w-full border-none py-2 text-5xl font-serif outline-none bg-transparent text-slate-800 placeholder-slate-300 m-0 p-0" placeholder="0.0" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 border-none p-0">Certified Marksheet Extract</label>
                                        <div className="border border-dashed border-violet-200 bg-violet-50/30 rounded-3xl p-10 flex items-center justify-center hover:bg-violet-50 transition-colors cursor-pointer relative group">
                                            <input type="file" onChange={(e) => handleFileChange('marksheet', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-violet-700 group-hover:scale-105 transition-transform">{documents.marksheet ? documents.marksheet.name : 'Select PDF / Image'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tab 5: Financial */}
                        {activeTab === 4 && (
                            <div className="animate-fade-in-up">
                                <div className="mb-10 border-b border-gray-100 pb-6 flex items-end gap-4">
                                    <h3 className="font-serif text-4xl tracking-tight text-gray-900 leading-none">Financial Routing</h3>
                                    <span className="text-violet-600 font-mono font-bold text-sm bg-violet-50 px-2 py-1 rounded-md mb-1">05</span>
                                </div>
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-10 flex items-start gap-4 shadow-inner">
                                    <AlertCircle className="text-amber-500 mt-0.5 flex-shrink-0" size={20} />
                                    <p className="text-sm text-amber-900 font-medium leading-relaxed font-serif m-0 p-0 line-clamp-none">Ensure your routing numbers perfectly match the attached documents. Discrepancies will trigger an automated AI rejection and delay disbursement by up to 14 days.</p>
                                </div>

                                <div className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="group bg-blue-50/50 p-6 rounded-3xl border border-blue-100 focus-within:ring-4 focus-within:ring-blue-500/10 transition-shadow">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-600/70 mb-3 transition-colors border-none p-0">Target Account Number</label>
                                            <input name="bankAccountNo" value={formData.financialDetails.bankAccountNo || ''} onChange={(e) => handleChange('financialDetails', e)} className="w-full border-b border-blue-200 py-2 text-2xl font-mono tracking-wider outline-none focus:border-blue-500 bg-transparent text-blue-950 placeholder-blue-300 m-0 p-0" required />
                                        </div>
                                        <div className="group bg-blue-50/50 p-6 rounded-3xl border border-blue-100 focus-within:ring-4 focus-within:ring-blue-500/10 transition-shadow">
                                            <label className="block text-[11px] font-black uppercase tracking-widest text-blue-600/70 mb-3 transition-colors border-none p-0">Bank IFSC Code</label>
                                            <input name="ifscCode" value={formData.financialDetails.ifscCode || ''} onChange={(e) => handleChange('financialDetails', e)} className="w-full border-b border-blue-200 py-2 text-2xl font-mono tracking-wider outline-none focus:border-blue-500 bg-transparent uppercase text-blue-950 placeholder-blue-300 m-0 p-0" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-black uppercase tracking-widest text-violet-600/70 mb-2 border-none p-0">Verified Bank Passbook</label>
                                        <div className="border border-dashed border-violet-200 bg-violet-50/30 rounded-3xl p-10 flex items-center justify-center hover:bg-violet-50 transition-colors cursor-pointer relative group">
                                            <input type="file" onChange={(e) => handleFileChange('bankPassbook', e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <span className="text-sm font-bold uppercase tracking-widest text-violet-700 group-hover:scale-105 transition-transform">{documents.bankPassbook ? documents.bankPassbook.name : 'Select PDF / Image'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Bottom Controls (Vibrant Gradient Buttons) */}
                    <div className="mt-14 pt-8 border-t border-gray-100 flex justify-between items-center relative gap-4">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-200 to-transparent"></div>
                        <button
                            type="button"
                            onClick={handlePrevTab}
                            className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest transition-all px-6 py-3 rounded-2xl whitespace-nowrap ${activeTab === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 text-gray-500 hover:text-violet-600 hover:bg-violet-50 border border-transparent hover:border-violet-100'}`}
                        >
                            <ArrowLeft size={16} /> Return Step
                        </button>

                        {activeTab < tabs.length - 1 ? (
                            <button
                                type="button"
                                onClick={handleNextTab}
                                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:from-violet-500 hover:to-indigo-500 shadow-xl shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 whitespace-nowrap ml-auto"
                            >
                                Continue Forward <ArrowRight size={16} />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:from-emerald-400 hover:to-teal-400 shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center gap-3 border border-emerald-400 whitespace-nowrap ml-auto"
                            >
                                {isResubmission ? 'Execute Resubmission' : isRenewal ? 'Execute Renewal' : 'Lodge Formal Application'} <CheckCircle size={16} />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            `}} />
        </div>
    );
};

export default ApplicationForm;
