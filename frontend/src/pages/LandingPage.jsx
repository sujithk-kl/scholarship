import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, Upload, Search, IndianRupee, Menu } from 'lucide-react';
import CampusAI from '../components/CampusAI';
import Sidebar from '../components/Sidebar';
import ImageCarousel from '../components/ImageCarousel';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Project Header */}
            <header className="bg-white shadow-md py-4 sticky top-0 z-40">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu Trigger - Visible on all screens as per user request (or at least consistently available) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
                            title="Open Menu"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>

                        {/* Custom College Logo Placeholder */}
                        <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            SS
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-extrabold text-blue-900 tracking-tight">Smart Scholarship</span>
                            <span className="text-sm text-blue-600 font-semibold tracking-wide">Management System</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">Final Year Project 2026</span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                        <Link to="/" className="text-blue-600">{t("Home")}</Link>
                        <Link to="/faqs" className="hover:text-blue-600 transition-colors">FAQs</Link>
                        <Link to="/announcements" className="hover:text-blue-600 transition-colors">{t("Announcements")}</Link>
                        <Link to="/helpdesk" className="hover:text-blue-600 transition-colors">Helpdesk</Link>
                        <Link to="/login" className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">{t("Login")}</Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section / Carousel */}
            <ImageCarousel />

            {/* Dashboard Cards Section */}
            <div className="py-12 -mt-10 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 shadow-2xl rounded-lg overflow-hidden">

                        {/* Students Card */}
                        <Link to="/students" className="relative group overflow-hidden h-64 border-r border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Students"
                            />
                            <div className="absolute inset-0 bg-pink-600/60 group-hover:bg-pink-600/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
                                <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <svg className="w-14 h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase drop-shadow-md">{t("Students")}</span>
                                <div className="mt-2 h-1 w-0 group-hover:w-16 bg-white transition-all duration-500 rounded-full"></div>
                            </div>
                        </Link>

                        {/* Institutions Card */}
                        <Link to="/institutes" className="relative group overflow-hidden h-64 border-r border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Institutions"
                            />
                            <div className="absolute inset-0 bg-purple-600/60 group-hover:bg-purple-600/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
                                <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <svg className="w-14 h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase drop-shadow-md">{t("Institutions")}</span>
                                <div className="mt-2 h-1 w-0 group-hover:w-16 bg-white transition-all duration-500 rounded-full"></div>
                            </div>
                        </Link>

                        {/* Officers Card */}
                        <Link to="/officers" className="relative group overflow-hidden h-64 border-r border-white/10">
                            <img
                                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Officers"
                            />
                            <div className="absolute inset-0 bg-blue-600/60 group-hover:bg-blue-600/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
                                <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <svg className="w-14 h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase drop-shadow-md">{t("Officers")}</span>
                                <div className="mt-2 h-1 w-0 group-hover:w-16 bg-white transition-all duration-500 rounded-full"></div>
                            </div>
                        </Link>

                        {/* Public Card */}
                        <Link to="/public" className="relative group overflow-hidden h-64">
                            <img
                                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=800&auto=format&fit=crop"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Public"
                            />
                            <div className="absolute inset-0 bg-teal-600/60 group-hover:bg-teal-600/40 transition-colors"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all">
                                <div className="mb-4 transform group-hover:-translate-y-2 transition-transform duration-500">
                                    <svg className="w-14 h-14 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                                </div>
                                <span className="text-2xl font-black tracking-tighter uppercase drop-shadow-md">{t("Public")}</span>
                                <div className="mt-2 h-1 w-0 group-hover:w-16 bg-white transition-all duration-500 rounded-full"></div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Info Section (Announcements & OTR) */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-12 justify-center items-start">

                        {/* Announcements */}
                        <div className="flex-1 text-center md:text-left max-w-md">
                            <div className="flex justify-center md:justify-start mb-4">
                                <div className="p-3 bg-pink-100 rounded-full">
                                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Announcements")}</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Application form of the candidate is fixed as Rs 30.00 (inclusive of all applicable taxes, etc.). To locate the nearest CSC please visit the link <a href="#" className="font-bold text-blue-600">https://locator.csccloud.in/</a>
                            </p>
                            <p className="text-sm text-gray-600 font-medium p-2 bg-yellow-50 border border-yellow-200 rounded">
                                Dear Student - If you are getting error 901 while doing face authentication, kindly update UIDAI AadhaarFaceRD App from Playstore.
                            </p>
                            <Link to="/announcements" className="inline-block mt-4 text-blue-600 font-bold hover:underline border-b-2 border-blue-600">View more</Link>
                        </div>

                        {/* Vertical Divider */}
                        <div className="hidden md:block w-px bg-gray-200 h-64"></div>

                        {/* OTR Section */}
                        <div className="flex-1 text-center md:text-left max-w-md">
                            <div className="flex justify-center md:justify-start mb-4">
                                <div className="p-3 bg-indigo-100 rounded-full">
                                    <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">{t("Get your OTR")}</h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                One Time Registration (OTR) is a unique 14-digit number issued based on the Aadhaar/Aadhaar Enrolment ID (EID) and is applicable for the entire academic career of the student.
                            </p>
                            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5 mb-6">
                                <li>OTR simplifies the scholarship application process thereby eliminating the need of registration in each academic year.</li>
                                <li>OTR is required to apply for scholarship on Smart Scholarship Portal.</li>
                            </ul>
                            <Link to="/register" className="inline-block px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors">{t("Apply now!")}</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm border-t border-gray-800">
                <div className="container mx-auto px-6">
                    <div className="mb-4 text-2xl font-bold text-white tracking-tight">{t("Smart Scholarship Management System")}</div>
                    <p className="mb-6 opacity-60">{t("Bridging the gap between ambitious students and educational opportunities.")}</p>
                    <div className="border-t border-gray-800 pt-6">
                        {/* Custom Footer Credit */}
                        <p>&copy; {t("2026 Final Year Project. Designed & Developed by")} <span className="text-blue-400 font-semibold">{t("[Your Name/Team]")}</span></p>
                        <p className="text-[10px] mt-2 text-gray-600">{t("Computer Engineering Department")}</p>
                    </div>
                </div>
            </footer>

            {/* AI Assistant Widget */}
            <CampusAI />
        </div>
    );
};

export default LandingPage;
