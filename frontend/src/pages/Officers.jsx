import { Megaphone, Users, KeyRound, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Officers = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Navbar placeholder or just back button as per screenshot */}
            <div className="p-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-12">Officer</h1>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Announcements Card */}
                    <div className="flex flex-col items-center text-center p-6">
                        <div className="mb-6">
                            <Megaphone className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Announcements</h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            From AY 2024-25 One Time Registration (OTR) no. is required to fill the scholarship application.
                            Department Nodal Officers are advised to inform the
                            students to register for OTR. For detailed guidelines on OTR please visit <Link to="/faqs" className="text-blue-600 hover:underline">OTR FAQs</Link>
                        </p>
                        <Link to="/announcements" className="text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5 hover:text-blue-700">
                            View all
                        </Link>
                    </div>

                    {/* Nodal Officers Card */}
                    <div className="flex flex-col items-center text-center p-6 border-l border-r border-gray-100">
                        <div className="mb-6">
                            <Users className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Nodal Officers <span className="font-normal text-gray-500">(Scheme-wise)</span>
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Find the list of Nodal Officers designated by the Department for each scheme
                        </p>
                        <Link to="/officers/list" className="text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5 hover:text-blue-700">
                            Find List
                        </Link>
                    </div>

                    {/* Login Card */}
                    <div className="flex flex-col items-center text-center p-6 border-l md:border-l-0 border-gray-100">
                        <div className="mb-6">
                            <KeyRound className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Login</h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Nodal officers can login using their USER ID and PASSWORD
                        </p>
                        <Link to="/login" className="text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5 hover:text-blue-700">
                            Login
                        </Link>
                    </div>

                    {/* Grievance Redressal Officers Card */}
                    <div className="flex flex-col items-center text-center p-6 md:col-start-1 md:col-span-1">
                        <div className="mb-6">
                            <Users className="w-24 h-24 text-purple-600" strokeWidth={1.5} />
                            {/* Ideally use a specific icon for Grievance like MessageSquareUser but Users works as generic */}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Grievance Redressal Officers <span className="font-normal text-gray-500">(Scheme-wise)</span>
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Find the list of Grievance Redressal Officers(GROs) for Scholarship Schemes
                        </p>
                        <Link to="/officers/grievance-redressal" className="text-blue-900 font-bold border-b-2 border-blue-900 pb-0.5 hover:text-blue-700">
                            Find List
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Officers;
