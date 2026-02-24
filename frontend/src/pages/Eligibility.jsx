import React from 'react';
import Navbar from '../components/Navbar';
import { CheckCircle, XCircle } from 'lucide-react';

const Eligibility = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4">Check Your Eligibility</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Before applying for any scholarship scheme, please review the general eligibility criteria outlined below.
                        Specific schemes may have additional requirements.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* General Criteria */}
                    <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-blue-600">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <CheckCircle size={20} />
                            </span>
                            General Requirements
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 min-w-[20px] mt-1" size={18} />
                                <span className="text-gray-700">Must be a permanent resident (domicile) of the state.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 min-w-[20px] mt-1" size={18} />
                                <span className="text-gray-700">Must have secured at least 50% marks in the previous qualifying examination.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 min-w-[20px] mt-1" size={18} />
                                <span className="text-gray-700">Must fulfill the minimum attendance requirement of 75%.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle className="text-green-500 min-w-[20px] mt-1" size={18} />
                                <span className="text-gray-700">The applicant should not be receiving any other scholarship/stipend.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Income Criteria */}
                    <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-green-600">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <span className="bg-green-100 p-2 rounded-full text-green-600">
                                <CheckCircle size={20} />
                            </span>
                            Income Criteria
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-1">Post Matric Scholarship (SC/ST)</h3>
                                <p className="text-sm text-gray-600">Annual family income should not exceed ₹2.5 Lakhs.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-1">Post Matric Scholarship (OBC/BC)</h3>
                                <p className="text-sm text-gray-600">Annual family income should not exceed ₹1.5 Lakhs.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-1">Merit-cum-Means Scholarship</h3>
                                <p className="text-sm text-gray-600">Annual family income should not exceed ₹2.5 Lakhs.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="mt-8 bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <h2 className="text-lg font-bold text-yellow-800 mb-4">Important Notes</h2>
                    <ul className="grid md:grid-cols-2 gap-4 text-sm text-yellow-900">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Aadhaar seeding with bank account is mandatory.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Income certificate must be issued by a competent authority.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Caste certificate is mandatory for category-based schemes.
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Any discrepancy in documents will lead to rejection.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Eligibility;
