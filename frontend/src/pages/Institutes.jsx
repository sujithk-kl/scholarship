import { Megaphone, FileEdit, KeyRound, MonitorPlay, Search, Unlock, Building2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Institutes = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Announcements",
            icon: Megaphone,
            desc: "Latest updates and guidelines for Institutes regarding scholarship applications and verification processes.",
            linkText: "View all",
            link: "/announcements",
            color: "text-pink-500"
        },
        {
            title: "Registration Form",
            icon: FileEdit,
            desc: "New Institutes can register on the portal to verify student applications.",
            linkText: "Apply now!",
            link: "/register?role=Institute",
            color: "text-pink-500"
        },
        {
            title: "Login",
            icon: KeyRound,
            desc: "Institute Nodal Officers can login to verify applications and manage institute profile.",
            linkText: "Login",
            link: "/login",
            color: "text-pink-500"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header / Back Button */}
            <div className="p-4 border-b">
                <div className="container mx-auto flex items-center">
                    <button onClick={() => navigate('/')} className="mr-4 p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-pink-600">Institute Services</h1>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {services.map((item, index) => (
                        <div key={index} className="flex flex-col items-start bg-white group">
                            <div className="mb-4 p-0">
                                <item.icon className={`w-12 h-12 ${item.color}`} strokeWidth={1.5} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">
                                {item.title}
                            </h3>

                            <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-4">
                                {item.desc}
                            </p>

                            <Link to={item.link} className="text-sm font-bold text-gray-800 border-b-2 border-gray-800 hover:text-blue-600 hover:border-blue-600 transition-colors mt-auto pt-1">
                                {item.linkText}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Institutes;
