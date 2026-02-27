import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu, ChevronDown, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';

const NSPHeader = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Unified Global Header */}
            <header className="backdrop-blur-md bg-white/80 border-b border-gray-100 py-4 sticky top-0 z-40 transition-all shadow-sm">
                <div className="container mx-auto px-6 flex justify-between items-center">

                    {/* Left Section: Menu Toggle + Logo */}
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu Trigger for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300 xl:hidden"
                            title="Open Sidebar"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* Custom College Logo */}
                        <Link to="/" className="relative flex items-center group cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="absolute inset-0 bg-blue-600 rounded-xl blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                            <div className="relative w-11 h-11 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md border border-gray-700 transition-transform duration-300 group-hover:scale-105">
                                SS
                            </div>
                            <div className="flex flex-col pl-3 border-l border-gray-200 ml-4 hidden sm:flex">
                                <span className="text-[18px] md:text-[22px] font-bold text-gray-900 tracking-tight leading-tight">Smart Scholarship</span>
                                <span className="text-[10px] md:text-[12px] text-gray-500 font-medium tracking-wide">Management System</span>
                            </div>
                        </Link>
                    </div>

                    {/* Middle Section: Navigation Links (Desktop) */}
                    <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
                        <Link to="/" className="text-gray-900 font-semibold relative after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[2px] after:bg-gray-900">
                            {t("Home")}
                        </Link>
                        <Link to="/about" className="relative text-gray-500 hover:text-gray-900 transition-colors duration-300 group">
                            {t("About Us")}
                            <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/schemes" className="relative text-gray-500 hover:text-gray-900 transition-colors duration-300 group">
                            {t("Schemes")}
                            <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                        </Link>

                        {/* More Menu Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-1.5 relative text-gray-500 hover:text-gray-900 transition-colors duration-300 group focus:outline-none"
                            >
                                {t("More Details")}
                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-full left-0 mt-4 w-48 bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    <Link onClick={() => setIsMenuOpen(false)} to="/institutes" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">{t("Institutes")}</Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/officers" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">{t("Officers")}</Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/public" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">{t("Public Details")}</Link>
                                    <Link onClick={() => setIsMenuOpen(false)} to="/crowdfunding" className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">{t("Crowdfunding")}</Link>
                                </div>
                            )}
                        </div>

                        {user?.role === 'Student' && (
                            <Link to="/student/recommendations" className="relative text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-300 flex items-center gap-1 group">
                                <span className="animate-pulse">✨</span> {t("AI Matches")}
                                <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        )}
                    </nav>

                    {/* Right Section: Language + Auth Actions */}
                    <div className="flex items-center gap-4 sm:gap-6 border-l border-gray-200 pl-4 sm:pl-6 ml-2">
                        {/* Language Selector */}
                        <select
                            className="bg-transparent text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none cursor-pointer tracking-wide appearance-none"
                            onChange={changeLanguage}
                            value={i18n.language || 'en'}
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                        </select>

                        {/* Auth Buttons / User Profile */}
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-xs font-bold text-gray-900">{user.name}</span>
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">({user.role})</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200 sm:hidden">
                                    <User className="w-4 h-4" />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 sm:px-5 sm:py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-all duration-300 text-xs sm:text-sm font-semibold tracking-wide border border-red-100"
                                >
                                    {t("Logout")}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/register" className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                                    {t("Register")}
                                </Link>
                                <Link to="/login" className="px-5 py-2 sm:px-7 sm:py-2.5 bg-gray-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-xs sm:text-sm font-semibold tracking-wide">
                                    {t("Login")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default NSPHeader;
