import { BarChart3, Search, GraduationCap, Users, User, MessageSquare, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Public = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Dashboard",
            icon: BarChart3,
            desc: "Visualization of the statistical data available on NSP regarding the receipt and processing of scholarship applications in schemes onboarded on NSP.",
            linkText: "View all",
            link: "/student/dashboard", // Or a public dashboard if it existed
            color: "text-[#00AEEF]" // Cyan/Blue
        },
        {
            title: "Scholarship Schemes",
            icon: Search,
            desc: "Search Schemes available on NSP",
            linkText: "Search now!",
            link: "/schemes",
            color: "text-[#00AEEF]"
        },
        {
            title: "Scholarship Eligibility",
            icon: GraduationCap,
            desc: "Know your eligibility for different scholarship schemes available on Smart Scholarship Portal.",
            linkText: "View",
            link: "/eligibility",
            color: "text-[#00AEEF]"
        },

        {
            title: "Grievance Registration",
            icon: MessageSquare,
            desc: "Register Your Grievance or Check Status",
            linkText: "View",
            link: "/grievance",
            color: "text-[#00AEEF]"
        },
        {
            title: "NSP Helpdesk",
            icon: HelpCircle,
            desc: "NSP Helpdesk",
            linkText: "View",
            link: "/helpdesk",
            color: "text-[#00AEEF]"
        },

    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800 flex flex-col">
            {/* Header / Back Button */}
            <div className="bg-white p-4 border-b">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-gray-800">Public</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-start p-6 rounded-lg transition-all hover:shadow-lg bg-white
                                ${item.isHighlight ? 'border border-[#00AEEF]' : 'border-0'}
                            `}
                        >
                            <div className="mb-4 text-[#00AEEF]">
                                <item.icon className="w-12 h-12" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {item.title}
                            </h3>

                            <p className="text-xs text-gray-500 mb-4 leading-relaxed min-h-[40px]">
                                {item.desc}
                            </p>

                            <Link
                                to={item.link}
                                className="text-xs font-bold text-gray-800 border-b border-gray-800 hover:text-[#00AEEF] hover:border-[#00AEEF] transition-colors mt-auto"
                            >
                                {item.linkText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scale/Logos Footer */}
            <div className="bg-gray-50 py-8 border-t mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Logos removed for college project */}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-4 space-x-4">
                        <a href="#">Copyright Policy</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms and Conditions</a> | <a href="#">Disclaimer</a> | <a href="#">Hyperlink</a> | <a href="#">Site Map</a>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">Last update on October 2026</p>
                </div>
            </div>
        </div>
    );
};

export default Public;
