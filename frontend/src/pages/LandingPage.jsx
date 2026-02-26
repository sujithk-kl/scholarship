import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileEdit, Upload, Search, IndianRupee, Menu, ArrowRight, Bell, CreditCard } from 'lucide-react';
import CampusAI from '../components/CampusAI';
import Sidebar from '../components/Sidebar';
import ImageCarousel from '../components/ImageCarousel';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans text-gray-900 selection:bg-blue-200">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Global Header is rendered via App.jsx -> NSPHeader */}
            {/* Adding pt-6 to provide breathing room before the framed carousel starts */}
            <div className="pt-6 md:pt-8 bg-white pb-8 md:pb-12 rounded-b-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] z-20 relative">
                {/* Hero Section / Carousel */}
                <ImageCarousel />
            </div>

            {/* Main Content Area */}
            <main className="relative z-10 -mt-8 pt-20 pb-24">
                {/* Dashboard Cards Section */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">{t("Explore Portals")}</h2>
                        <p className="text-gray-500 text-lg">Navigate to the dedicated section designed for your specific needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {/* Students Card */}
                        <Link to="/students" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <FileEdit size={120} />
                            </div>
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm z-10">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 z-10">{t("Students")}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow z-10">Apply for scholarships, track status, and manage profile.</p>
                            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 z-10">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>

                        {/* Institutions Card */}
                        <Link to="/institutes" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <Upload size={120} />
                            </div>
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm z-10">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 z-10">{t("Institutions")}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow z-10">Verify applications and manage institutional details.</p>
                            <div className="flex items-center text-purple-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 z-10">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>

                        {/* Officers Card */}
                        <Link to="/officers" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <Search size={120} />
                            </div>
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm z-10">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 z-10">{t("Officers")}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow z-10">Administer schemes, disburse funds, and generate reports.</p>
                            <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 z-10">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>

                        {/* Public Card */}
                        <Link to="/public" className="group flex flex-col bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700">
                                <IndianRupee size={120} />
                            </div>
                            <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500 shadow-sm z-10">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 z-10">{t("Public")}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow z-10">View scheme details, eligibility, and announcements.</p>
                            <div className="flex items-center text-teal-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 z-10">
                                Enter Portal <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Info Section (Announcements & Updates) */}
                <div className="mt-24 container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                        {/* Announcements Feature */}
                        <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                            {/* Decorative Background element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

                            <div className="flex items-center mb-8 relative z-10">
                                <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl mr-4 shadow-inner">
                                    <Bell size={28} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">{t("Announcements")}</h3>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow relative z-10">
                                <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors group cursor-pointer">
                                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">Application Form Fee</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        Application form of the candidate is fixed as Rs 30.00 (inclusive of all applicable taxes, etc.). <a href="#" className="font-medium text-blue-600 hover:underline">Locate nearest CSC</a>
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-yellow-50 border border-yellow-200/60 hover:border-yellow-300 transition-colors group cursor-pointer">
                                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-yellow-700 transition-colors">Face Authentication Error 901</h4>
                                    <p className="text-sm text-yellow-800/80 leading-relaxed">
                                        If you are experiencing issue 901 during auth, kindly update the UIDAI AadhaarFaceRD App from Playstore immediately.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-auto relative z-10">
                                <Link to="/announcements" className="inline-flex items-center justify-center bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg w-full sm:w-auto">
                                    View all announcements
                                </Link>
                            </div>
                        </div>

                        {/* OTR Feature */}
                        <div className="bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] rounded-[2rem] p-8 md:p-10 shadow-2xl text-white flex flex-col relative overflow-hidden">
                            {/* Decorative Background element */}
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

                            <div className="flex items-center mb-8 relative z-10">
                                <div className="p-3 bg-white/10 text-white rounded-2xl mr-4 shadow-inner backdrop-blur-md border border-white/10">
                                    <CreditCard size={28} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t("Get your OTR")}</h3>
                            </div>

                            <p className="text-gray-300 text-base md:text-lg mb-6 leading-relaxed font-medium relative z-10">
                                One Time Registration (OTR) is a unique 14-digit number issued based on the Aadhaar ID, applicable for your entire academic career.
                            </p>

                            <ul className="text-white/80 space-y-3 mb-10 flex-grow relative z-10">
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-sm">Simplifies application processes, ending yearly redundant registrations.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 mr-3 flex-shrink-0"></div>
                                    <span className="text-sm">Mandatory requirement for applying to any scholarship on the portal.</span>
                                </li>
                            </ul>

                            <div className="mt-auto relative z-10">
                                <Link to="/register" className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl w-full sm:w-auto transform hover:-translate-y-0.5">
                                    {t("Apply now!")} <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            {/* Premium Minimal Footer */}
            <footer className="bg-white text-gray-500 py-12 text-center text-sm border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="mb-2 text-xl font-bold text-gray-900 tracking-tight">{t("Smart Scholarship Management System")}</div>
                    <p className="mb-8 font-medium">Bridging the gap between ambitious students and educational opportunities.</p>
                    <div className="pt-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-100/60 max-w-4xl mx-auto">
                        <p className="mb-4 md:mb-0">&copy; {t("2026 Final Year Project. Developed by")} <span className="text-gray-900 font-bold">{t("[Your Name/Team]")}</span></p>
                        <div className="flex gap-6 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            <Link to="/about" className="hover:text-gray-900 transition-colors">About</Link>
                            <Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link>
                            <Link to="/faqs" className="hover:text-gray-900 transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* AI Assistant Widget */}
            <CampusAI />
        </div>
    );
};

export default LandingPage;
