import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "Who is eligible to apply for the scholarship?",
            answer: "Eligibility depends on the specific scheme. Generally, students must be permanent residents of the state, studying in recognized institutions, and meet specific income and academic criteria (usually 50% marks and 75% attendance)."
        },
        {
            question: "What documents are required for the application?",
            answer: "Commonly required documents include: Aadhaar Card, Income Certificate, Caste Certificate (if applicable), Domicile Certificate, Previous Year Marksheet, Bank Passbook, and Passport Size Photograph."
        },
        {
            question: "How can I track my application status?",
            answer: "After logging in, you can view your application status on your dashboard. You will see stages like 'Submitted', 'Institute Verified', 'Officer Verified', and finally 'Approved'."
        },
        {
            question: "Can I edit my application after submission?",
            answer: "No, once an application is final submitted, it cannot be edited by the student. However, if the Institute or Officer marks it as 'Defective', you will be given an option to resubmit with corrections."
        },
        {
            question: "Is Aadhaar seeding with a bank account mandatory?",
            answer: "Yes, for the direct transfer of scholarship funds (DBT), your bank account must be seeded (linked) with your Aadhaar number."
        },
        {
            question: "What should I do if I forget my password?",
            answer: "You can use the 'Forgot Password' link on the login page. You will need to verify your email address to reset your password."
        },
        {
            question: "How will I receive the scholarship amount?",
            answer: "The scholarship amount is transferred directly to your Aadhaar-linked bank account through the Direct Benefit Transfer (DBT) mode."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-blue-900 mb-4 flex justify-center items-center gap-2">
                        <HelpCircle /> Frequently Asked Questions
                    </h1>
                    <p className="text-gray-600">
                        Find answers to the most common questions about the scholarship portal and application process.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-semibold text-gray-800 text-lg">{faq.question}</span>
                                {openIndex === index ? (
                                    <ChevronUp className="text-blue-600" />
                                ) : (
                                    <ChevronDown className="text-gray-400" />
                                )}
                            </button>
                            {openIndex === index && (
                                <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 bg-blue-50/30">
                                    <p className="mt-4">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center p-8 bg-blue-100 rounded-xl">
                    <h2 className="text-xl font-bold text-blue-900 mb-2">Still have questions?</h2>
                    <p className="text-blue-700 mb-6">If you couldn't find your answer, feel free to contact our helpdesk.</p>
                    <a
                        href="/contact"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
