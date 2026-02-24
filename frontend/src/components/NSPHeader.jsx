import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useTranslation } from 'react-i18next';

const NSPHeader = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { t, i18n } = useTranslation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const changeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Top Strip - Government of India */}
            <div className="bg-white border-b py-2 text-xs md:text-sm font-medium text-gray-600">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex gap-4">
                        <span>{t("COLLEGE SCHOLARSHIP PORTAL")}</span>
                        <span>{t("STUDENT SERVICES DIVISION")}</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="hidden md:inline">{t("Skip to Main Content")}</span>
                        <span className="hidden md:inline">{t("Screen Reader Access")}</span>
                        <span>A-</span>
                        <span>A</span>
                        <span>A+</span>
                        <div className="flex bg-gray-200 rounded overflow-hidden">
                            <button className="px-2 bg-black text-white">A</button>
                            <button className="px-2 bg-white text-black">A</button>
                        </div>
                        <select
                            className="bg-transparent text-xs border rounded"
                            onChange={changeLanguage}
                            value={i18n.language}
                        >
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Header - NSP Logo & Branding */}
            <header className="bg-white shadow-sm py-4">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Hamburger Menu Trigger */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors lg:hidden"
                            title="Open Menu"
                        >
                            <Menu className="w-6 h-6 text-gray-600" />
                        </button>

                        <div className="flex items-center gap-3" onClick={() => navigate('/')}>
                            {/* Emblem Placeholder (Ashoka Chakra) */}
                            <img
                                src="https://scholarships.gov.in/assets/images/emblem.png"
                                alt="Satyamev Jayate"
                                className="h-12 md:h-16 object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none'; // Fallback if image fails
                                }}
                            />

                            <div className="flex flex-col">
                                <span className="text-xl md:text-2xl font-bold text-[#14477b] leading-tight">{t("Smart Scholarship Management System")}</span>
                                <span className="text-xs md:text-sm text-gray-600 font-semibold">{t("Student Welfare Department, College Administration")}</span>
                            </div>
                        </div>
                    </div>

                    {/* Left side remains, right side removed as requested */}
                </div>
            </header>

            {/* Navigation Bar (Green Strip like NSP) */}
            <nav className="bg-[#2C3E50] text-white py-0 relative z-30">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center">
                        <div className="flex">
                            <Link to="/" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600">{t("Home")}</Link>
                            <Link to="/about" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600 hidden md:block">{t("About Us")}</Link>
                            <Link to="/schemes" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600 hidden md:block">{t("Schemes")}</Link>
                            <Link to="/institutes" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600 hidden md:block">{t("Institutes")}</Link>
                            <Link to="/officers" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600 hidden md:block">{t("Officers")}</Link>
                            <Link to="/public" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600 hidden md:block">{t("Public Details")}</Link>
                            <Link to="/crowdfunding" className="px-6 py-3 hover:bg-[#34495e] text-sm font-medium border-r border-gray-600">{t("Crowdfunding")}</Link>
                            {user?.role === 'Student' && (
                                <Link to="/student/recommendations" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-sm font-bold border-r border-gray-600 flex items-center gap-2">
                                    <span className="animate-pulse">✨</span> {t("AI Matches")}
                                </Link>
                            )}
                        </div>

                        <div className="flex items-center pr-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm hidden md:inline text-yellow-400 font-bold">{t("Welcome")} {user.name} ({user.role})</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-xs font-bold transition-colors uppercase tracking-wider"
                                    >
                                        {t("Logout")}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex text-sm">
                                    <Link to="/login" className="px-4 py-3 hover:bg-[#34495e] font-bold border-l border-gray-600">{t("Login")}</Link>
                                    <Link to="/register" className="px-4 py-3 hover:bg-[#34495e] font-bold border-l border-gray-600">{t("Register")}</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NSPHeader;
