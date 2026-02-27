import { BarChart3, Search, GraduationCap, Users, User, MessageSquare, HelpCircle, ArrowLeft, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Public = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Open Data Dashboard",
            icon: BarChart3,
            desc: "Access aggregated statistical visualization regarding the receipt, status, and processing volume of system-wide applications.",
            linkText: "View Analytics",
            link: "/student/dashboard", // Or a public dashboard if it existed
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Scheme Registry",
            icon: Search,
            desc: "Browse and search the centralized registry of all active scholarship programs onboarded onto the portal infrastructure.",
            linkText: "Search Schemes",
            link: "/schemes",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100"
        },
        {
            title: "Eligibility Frameworks",
            icon: GraduationCap,
            desc: "Review defined parameters and criteria combinations to determine potential applicant eligibility across available schemes.",
            linkText: "Check Criteria",
            link: "/eligibility",
            color: "text-slate-700",
            bgColor: "bg-slate-100",
            borderColor: "border-slate-200"
        },
        {
            title: "Dispute Registry",
            icon: MessageSquare,
            desc: "Initiate formal grievance tickets or track the resolution status of existing logged complaints and operational issues.",
            linkText: "File Grievance",
            link: "/grievance",
            color: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "border-rose-100"
        },
        {
            title: "System Helpdesk",
            icon: HelpCircle,
            desc: "Obtain administrative support, review frequently asked questions, or contact technical operatives for issue mitigation.",
            linkText: "Access Support",
            link: "/helpdesk",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-100"
        },

    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col selection:bg-blue-600 selection:text-white relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>

            {/* Header / Command Bar */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-sm group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-blue-950 leading-none mb-1">Public Access</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Open Data & Information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 flex-1 w-full">
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Public <span className="text-blue-700">Services</span></h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Open-access resources including statistical dashboards, scheme registries, and formalized support channels for general citizens.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col h-full relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent -z-10 opacity-50 group-hover:from-blue-50 transition-colors"></div>

                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${item.bgColor} ${item.color} border ${item.borderColor} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon strokeWidth={1.5} size={28} />
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-800 transition-colors">
                    {item.title}
                </h3>

                <p className="text-sm text-slate-600 mb-8 leading-relaxed flex-grow font-medium">
                    {item.desc}
                </p>

                <Link to={item.link} className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm">
                    {item.linkText}
                </Link>
        </div>
    ))
}
                </div >
            </main >

    {/* Specialized Footer replacing the old generic one */ }
    < footer className = "border-t border-slate-200 bg-white mt-auto" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <a href="#" className="hover:text-blue-600 transition-colors">Policy</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                <span className="text-slate-300">|</span>
                <a href="#" className="hover:text-blue-600 transition-colors">Sitemap</a>
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                System Build V-2026.10
            </div>
        </div>
            </footer >

    <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default Public;
