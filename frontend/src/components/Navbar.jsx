import { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Hide Navbar on specific public pages if needed, but for Project Identity we want it consistent on internal pages
    // The LandingPage has its own header, so we might hide this default one on '/'
    if (['/', '/login', '/register'].includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="bg-white shadow px-6 py-3 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">SS</div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-xl font-bold text-blue-900 tracking-tight">Smart Scholarship</span>
                        <span className="text-[10px] text-gray-600 block leading-none">Management System</span>
                    </div>
                </div>
                <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>
                <span className="hidden md:block text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Project 2026</span>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/faqs" className="text-sm font-medium text-gray-600 hover:text-blue-600">FAQs</Link>
                <Link to="/schemes" className="text-sm font-medium text-gray-600 hover:text-blue-600">Schemes</Link>
                <Link to="/announcements" className="text-sm font-medium text-gray-600 hover:text-blue-600">Announcements</Link>
                <Link to="/helpdesk" className="text-sm font-medium text-gray-600 hover:text-blue-600">Helpdesk</Link>

                {user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 font-medium">Hello, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Register</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
