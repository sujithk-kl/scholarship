import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
                    <h1 className="text-3xl font-bold text-blue-900 mb-6">About Us</h1>
                    <div className="mb-8">
                        <img
                            src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Students Studying"
                            className="w-full h-64 object-cover rounded-lg shadow-md mb-6"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.insertAdjacentHTML('afterbegin', '<div class="w-full h-64 rounded-lg shadow-md mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-bold">🎓 Smart Scholarship Portal</div>');
                            }}
                        />
                        <p className="text-gray-700 mb-4 text-justify leading-relaxed">
                            The <strong>Smart Scholarship Portal</strong> is a state-of-the-art digital platform conceptualized to revolutionize the way educational scholarships are administered and disbursed. Recognizing the financial barriers that often hinder talented students from pursuing higher education, this portal serves as a bridge between government/institutional funds and deserving candidates.
                        </p>
                        <p className="text-gray-700 mb-4 text-justify leading-relaxed">
                            Our system integrates advanced verification mechanisms to ensure that every rupee spent reaches the intended beneficiary without leakage or delay. By moving the entire process online, we have eliminated the cumbersome paperwork and physical visits previously required, allowing students to focus on what matters most—their education.
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold text-blue-900 mb-4 border-l-4 border-blue-600 pl-3">Our Core Objectives</h2>
                    <ul className="grid md:grid-cols-2 gap-4 mb-8">
                        <li className="flex items-start bg-blue-50 p-3 rounded">
                            <span className="text-blue-600 mr-2">✔</span>
                            <span className="text-gray-700">Ensure 100% timely disbursement of scholarships via Direct Benefit Transfer (DBT).</span>
                        </li>
                        <li className="flex items-start bg-blue-50 p-3 rounded">
                            <span className="text-blue-600 mr-2">✔</span>
                            <span className="text-gray-700">Create a unified, transparent database of all scholarship schemes and beneficiaries.</span>
                        </li>
                        <li className="flex items-start bg-blue-50 p-3 rounded">
                            <span className="text-blue-600 mr-2">✔</span>
                            <span className="text-gray-700">Eliminate duplication and fraud through Aadhaar-based authentication.</span>
                        </li>
                        <li className="flex items-start bg-blue-50 p-3 rounded">
                            <span className="text-blue-600 mr-2">✔</span>
                            <span className="text-gray-700">Harmonize different scholarship schemes under a single umbrella for easy access.</span>
                        </li>
                        <li className="flex items-start bg-blue-50 p-3 rounded">
                            <span className="text-blue-600 mr-2">✔</span>
                            <span className="text-gray-700">Provide real-time tracking of application status for students and administration.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
export default About;
