import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        { q: "How do I register for the scholarship?", a: "Click on the 'Register' button on the homepage, select 'Student' role, and follow the OTR process. You will need your Mobile Number and Email." },
        { q: "What documents are required for verification?", a: "You need your Aadhaar Card, Income Certificate, Previous Year Marksheets, and Bank Account details." },
        { q: "How can I track my application status?", a: "Login to your Student Dashboard. The status bar will show the current stage (Submitted -> Verified -> Approved)." },
        { q: "Is there an application fee?", a: "No, the application process is completely free of cost for all students." },
        { q: "Can I edit my application after submission?", a: "No, once submitted, you cannot edit the application. However, you can withdraw and resubmit before the deadline if the institute has not verified it yet." }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(location === index ? null : index)}
                                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none hover:bg-gray-50"
                            >
                                <span className="font-semibold text-gray-800">{item.q}</span>
                                <span className="text-blue-600 font-bold">{openIndex === index ? '−' : '+'}</span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 py-4 bg-blue-50 text-gray-700 text-sm border-t border-gray-100 animate-fade-in">
                                    {item.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
