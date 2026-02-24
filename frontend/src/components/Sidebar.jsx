import { X, Building2, User, Users, GraduationCap, BarChart3, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useContext(AuthContext);

    // Close sidebar on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Prevent scrolling when sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <div className={`fixed top-0 left-0 w-80 h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto`}>

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-bold text-lg text-blue-900">Menu</span>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Role Specific Quick Links */}
                {user && (
                    <div className="p-4 bg-blue-50 border-b">
                        <p className="text-xs font-bold text-blue-600 uppercase mb-3">Quick Access</p>
                        <div className="grid grid-cols-1 gap-2">
                            {user.role === 'Admin' && (
                                <>
                                    <Link to="/admin/dashboard" onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-white rounded transition-all text-sm font-medium text-gray-700">
                                        <LayoutDashboard className="w-4 h-4 text-blue-600" />
                                        Admin Dashboard
                                    </Link>
                                    <Link to="/admin/analytics" onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-white rounded transition-all text-sm font-medium text-gray-700">
                                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                                        Admin Analytics
                                    </Link>
                                </>
                            )}
                            {user.role === 'Verifier' && (
                                <Link to="/verifier/dashboard" onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-white rounded transition-all text-sm font-medium text-gray-700">
                                    <ShieldCheck className="w-4 h-4 text-green-600" />
                                    Verifier Dashboard
                                </Link>
                            )}
                            {(user.role === 'Student' || !user.role) && (
                                <Link to="/student/dashboard" onClick={onClose} className="flex items-center gap-3 p-2 hover:bg-white rounded transition-all text-sm font-medium text-gray-700">
                                    <LayoutDashboard className="w-4 h-4 text-red-600" />
                                    Student Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="py-4">

                    {/* Students Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 px-6 mb-2 text-[#D63384] font-bold">
                            <GraduationCap className="w-5 h-5" />
                            <span>Students</span>
                        </div>
                        <ul className="space-y-3 px-6 pl-14 text-sm text-gray-600">
                            <li><Link to="/register" className="hover:text-blue-600">Apply For One Time Registration (OTR)</Link></li>
                            <li><Link to="/student/login" className="hover:text-blue-600">Apply For Scholarship</Link></li>
                            <li><Link to="/schemes" className="hover:text-blue-600">Schemes</Link></li>
                            <li><Link to="/student/login" className="hover:text-blue-600">Application Status</Link></li>
                            <li><Link to="/payment-status" className="hover:text-blue-600">Track Your Payment</Link></li>
                        </ul>
                    </div>

                    <div className="border-t border-gray-100 my-4 mx-6"></div>

                    {/* Support & Help */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 px-6 mb-2 text-teal-600 font-bold">
                            <Users className="w-5 h-5" />
                            <span>Support</span>
                        </div>
                        <ul className="space-y-3 px-6 pl-14 text-sm text-gray-600">
                            <li><Link to="/eligibility" className="hover:text-blue-600">Check Eligibility</Link></li>
                            <li><Link to="/helpdesk" className="hover:text-blue-600">Helpdesk</Link></li>
                            <li><Link to="/grievance" className="hover:text-blue-600">Grievance Registration</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="bg-gray-100 p-6 mt-auto">
                    <ul className="space-y-3 text-sm text-gray-600">
                        <li><Link to="/about" className="hover:text-blue-600">About Us</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600">Contact Us</Link></li>
                        <li><Link to="/sitemap" className="hover:text-blue-600">Site Map</Link></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
