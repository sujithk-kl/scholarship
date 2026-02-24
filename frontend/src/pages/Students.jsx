import { Megaphone, IdCard, UserPlus, Search, FileText, CreditCard, MapPin, Fingerprint, Accessibility, ArrowLeft } from 'lucide-react';
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
            color: "text-[#D63384]"
        },
        {
            title: "OTR",
            icon: IdCard,
            desc: "One Time Registration (OTR) is a unique number applicable for the entire academic career of the student.",
            subDesc: "OTR is required to apply for scholarships on Smart Scholarship Portal.",
            linkText: "Login",
            link: "/student/login",
            color: "text-[#D63384]"
        },
        {
            title: "Apply For Scholarship",
            icon: UserPlus,
            desc: "Login with your OTR ID and PASSWORD to fill and check status of your Scholarship application.",
            linkText: "Login",
            link: "/student/login",
            color: "text-[#D63384]"
        },
        {
            title: "Scholarship Schemes",
            icon: Search,
            desc: "List of scholarship schemes with specification, FAQ and scheme opening and closing timeline.",
            linkText: "View Schemes",
            link: "/schemes",
            color: "text-[#D63384]"
        },
        {
            title: "Application Status",
            icon: FileText,
            desc: "Check the status of your submitted applications.",
            linkText: "Login",
            link: "/student/login",
            isHighlight: true,
            color: "text-[#D63384]"
        },
        {
            title: "Track Your Payment",
            icon: CreditCard,
            desc: "Track your scholarship disbursement status.",
            linkText: "Track Your Payment",
            link: "/payment-status",
            color: "text-[#D63384]"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header matching other pages */}
            <div className="bg-[#FF6B6B] text-white p-4 shadow-sm">
                <div className="container mx-auto flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="hover:bg-red-500 p-1 rounded transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                    <h1 className="text-xl font-bold">Students Services</h1>
                </div>
            </div>

            {/* Hero Campus Image */}
            <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
                    alt="College Campus Aerial View" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="container mx-auto">
                        <h2 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg">
                            Smart Scholarship Portal
                        </h2>
                        <p className="text-sm md:text-lg text-gray-200 mt-2 drop-shadow">
                            Empowering students to achieve their academic dreams
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((item, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-start p-6 rounded-lg transition-all hover:shadow-lg ${item.isHighlight
                                ? 'border border-pink-300 bg-white shadow-sm'
                                : 'border border-transparent hover:border-gray-100'
                                }`}
                        >
                            <div className="mb-4 text-[#D63384]">
                                <item.icon className="w-12 h-12" strokeWidth={1.5} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {item.title}
                                {item.subTitle && <span className="block text-sm font-normal text-gray-500">{item.subTitle}</span>}
                            </h3>

                            {item.desc && (
                                <p className="text-xs text-gray-600 mb-2 leading-relaxed">
                                    {item.desc}
                                </p>
                            )}

                            {item.subDesc && (
                                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                                    {item.subDesc}
                                </p>
                            )}

                            <div className="mt-auto flex flex-col items-start gap-1">
                                <Link to={item.link} className="text-sm font-bold text-gray-800 border-b-2 border-gray-800 hover:text-[#D63384] hover:border-[#D63384] transition-colors">
                                    {item.linkText}
                                </Link>
                                {item.subLinkText && (
                                    <Link to="#" className="text-xs font-bold text-gray-800 border-b border-gray-400 hover:text-[#D63384] hover:border-[#D63384] transition-colors mt-2">
                                        {item.subLinkText}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Students;
