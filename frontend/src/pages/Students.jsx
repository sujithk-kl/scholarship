import { Megaphone, IdCard, UserPlus, Search, FileText, CreditCard, ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Students = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Announcements",
            icon: Megaphone,
            desc: "Portal is now open for Academic Year 2025-26 to receive applications for college scholarship schemes.",
            subDesc: "Students can now start registering to get their One Time Registration (OTR) number.",
            linkText: "View all",
            link: "/announcements",
            colorClass: "text-pink-600",
            bgClass: "bg-pink-50"
        },
        {
            title: "OTR",
            icon: IdCard,
            desc: "One Time Registration (OTR) is a unique number applicable for the entire academic career of the student.",
            subDesc: "OTR is required to apply for scholarships on Smart Scholarship Portal.",
            linkText: "Login",
            link: "/student/login",
            colorClass: "text-blue-600",
            bgClass: "bg-blue-50"
        },
        {
            title: "Apply For Scholarship",
            icon: UserPlus,
            desc: "Login with your OTR ID and PASSWORD to fill and check status of your Scholarship application.",
            linkText: "Login",
            link: "/student/login",
            colorClass: "text-indigo-600",
            bgClass: "bg-indigo-50"
        },
        {
            title: "Scholarship Schemes",
            icon: Search,
            desc: "List of scholarship schemes with specification, FAQ and scheme opening and closing timeline.",
            linkText: "View Schemes",
            link: "/schemes",
            colorClass: "text-purple-600",
            bgClass: "bg-purple-50"
        },
        {
            title: "Application Status",
            icon: FileText,
            desc: "Check the status of your submitted applications.",
            linkText: "Login",
            link: "/student/login",
            isHighlight: true,
            colorClass: "text-orange-600",
            bgClass: "bg-orange-50"
        },
        {
            title: "Track Your Payment",
            icon: CreditCard,
            desc: "Track your scholarship disbursement status.",
            linkText: "Track Your Payment",
            link: "/payment-status",
            colorClass: "text-teal-600",
            bgClass: "bg-teal-50"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans text-gray-900 selection:bg-blue-200">
            {/* Global Header is rendered via App.jsx -> NSPHeader */}

            {/* Page Header Bar (Minimalist) */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-[72px] z-30 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 flex items-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-500 hover:text-gray-900 transition-colors font-medium text-sm group"
                    >
                        <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors mr-2">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to Home
                    </button>

                    {/* Breadcrumb style */}
                    <div className="hidden md:flex items-center ml-6 text-sm text-gray-400">
                        <span>Portals</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="font-semibold text-gray-900">Students Services</span>
                    </div>
                </div>
            </div>

            <main className="pb-24 pt-8">
                {/* Hero Campus Image - Framed Style (Like Landing Page) */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 border border-gray-200/20 mb-16">
                        <img
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                            alt="College Campus Aerial View"
                            className="w-full h-full object-cover opacity-60 mix-blend-overlay transition-transform duration-[3000ms] hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 z-10 flex flex-col justify-end">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
                                <UserPlus className="w-4 h-4" /> Student Portal
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-2">
                                Smart Scholarship Access
                            </h2>
                            <p className="text-base md:text-xl text-gray-200 drop-shadow-md font-medium max-w-2xl opacity-90">
                                Empowering students to achieve their academic dreams through streamlined financial support.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="container mx-auto px-4 md:px-6">
                    <div className="mb-10 max-w-2xl">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight mb-3">Student Services</h3>
                        <p className="text-gray-500">Access everything you need for your scholarship journey in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {services.map((item, index) => (
                            <div
                                key={index}
                                className={`group flex flex-col bg-white rounded-3xl p-8 shadow-sm border ${item.isHighlight ? 'border-orange-200 shadow-orange-100/50' : 'border-gray-100'} hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden`}
                            >
                                {/* Background Decorative Icon */}
                                <div className={`absolute -right-6 -top-6 opacity-[0.03] transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ${item.colorClass}`}>
                                    <item.icon size={160} />
                                </div>

                                {/* Main Icon Container */}
                                <div className={`w-14 h-14 ${item.bgClass} ${item.colorClass} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 z-10 relative`}>
                                    <item.icon className="w-7 h-7" strokeWidth={2} />

                                    {/* Highlight Badge */}
                                    {item.isHighlight && (
                                        <span className="absolute -top-2 -right-2 flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white"></span>
                                        </span>
                                    )}
                                </div>

                                <h4 className="text-xl font-bold text-gray-900 mb-3 z-10 tracking-tight">
                                    {item.title}
                                </h4>

                                <div className="flex-grow z-10 space-y-3">
                                    {item.desc && (
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                            {item.desc}
                                        </p>
                                    )}

                                    {item.subDesc && (
                                        <p className="text-xs text-gray-500 leading-relaxed italic">
                                            {item.subDesc}
                                        </p>
                                    )}
                                </div>

                                {/* Call to action Link */}
                                <div className="mt-8 pt-4 border-t border-gray-100/60 z-10">
                                    <Link
                                        to={item.link}
                                        className={`inline-flex items-center text-sm font-bold ${item.colorClass} group-hover:translate-x-2 transition-transform duration-300`}
                                    >
                                        {item.linkText} <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Secondary Help / Contact Strip */}
                <div className="container mx-auto px-4 md:px-6 mt-16">
                    <div className="bg-gray-900 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 pointer-events-none"></div>

                        <div className="z-10 text-center md:text-left mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold mb-2 tracking-tight">Need assistance?</h3>
                            <p className="text-gray-300 max-w-md">Our helpdesk team is available to assist you with registration, application, and technical queries.</p>
                        </div>

                        <div className="z-10">
                            <Link to="/helpdesk" className="inline-flex items-center justify-center bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors">
                                Contact Support <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Students;
