import { Megaphone, FileEdit, KeyRound, ArrowLeft, ShieldCheck, Building2, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Institutes = () => {
    const navigate = useNavigate();

    const services = [
        {
            title: "Announcements & Directives",
            icon: Megaphone,
            desc: "Critical updates and systemic guidelines for Institutes regarding scholarship processing, timelines, and verification protocols.",
            linkText: "View Broadcasts",
            link: "/announcements",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            title: "Institute Registration",
            icon: FileEdit,
            desc: "Enroll your institution into the central portal framework to formally authorize and verify student scholastic applications.",
            linkText: "Begin Enrollment",
            link: "/register?role=Institute",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100"
        },
        {
            title: "Nodal Officer Portal",
            icon: KeyRound,
            desc: "Secure login for registered Institute Nodal Officers to administrate profiles and execute application verification workflows.",
            linkText: "Authenticate",
            link: "/login",
            color: "text-slate-700",
            bgColor: "bg-slate-100",
            borderColor: "border-slate-200"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>

            {/* Header / Command Bar */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-sm group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-blue-950 leading-none mb-1">Institutional Hub</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Partner Operations Network</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Institutional <span className="text-blue-700">Services</span></h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Manage your institution's profile, oversee student applications, and access critical operational broadcasts through the secure partner network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((item, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col h-full relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>

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

                <Link to={item.link} className={`inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${index === 2 ? 'bg-blue-900 text-white hover:bg-blue-800 shadow-md' : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'}`}>
                {item.linkText} <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
    ))
}
                </div >
            </main >

    <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default Institutes;
