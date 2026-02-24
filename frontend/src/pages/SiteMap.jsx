import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const SiteMap = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-md">
                    <h1 className="text-3xl font-bold text-blue-900 mb-8">Site Map</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Student Services</h2>
                            <ul className="space-y-2 text-blue-700">
                                <li><Link to="/register" className="hover:underline">One Time Registration</Link></li>
                                <li><Link to="/student/login" className="hover:underline">Student Login</Link></li>
                                <li><Link to="/schemes" className="hover:underline">Scholarship Schemes</Link></li>
                                <li><Link to="/payment-status" className="hover:underline">Track Payment</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Support</h2>
                            <ul className="space-y-2 text-blue-700">
                                <li><Link to="/helpdesk" className="hover:underline">Helpdesk</Link></li>
                                <li><Link to="/grievance" className="hover:underline">Grievance Registration</Link></li>
                                <li><Link to="/eligibility" className="hover:underline">Check Eligibility</Link></li>
                                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Information</h2>
                            <ul className="space-y-2 text-blue-700">
                                <li><Link to="/about" className="hover:underline">About Us</Link></li>
                                <li><Link to="/announcements" className="hover:underline">Announcements</Link></li>
                                <li><Link to="/institutes" className="hover:underline">Institutes</Link></li>
                                <li><Link to="/officers" className="hover:underline">Officers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Administration</h2>
                            <ul className="space-y-2 text-blue-700">
                                <li><Link to="/login" className="hover:underline">Admin/Institute Login</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SiteMap;
