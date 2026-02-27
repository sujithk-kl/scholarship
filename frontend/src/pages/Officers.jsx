import { Megaphone, Users, KeyRound, ArrowLeft, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Officers = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>

            {/* Header / Command Bar */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-sm group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-blue-950 leading-none mb-1">State Officials Portal</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nodal & Grievance Directory</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
                <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in-up">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">Official <span className="text-blue-700">Directory</span></h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Access critical systemic announcements, locate designated Scheme Officers, or authenticate into the administrative verification network.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Announcements Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col items-start relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-50 to-transparent -z-10 opacity-60 group-hover:from-blue-50 transition-colors"></div>

                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-amber-50 border border-amber-100 text-amber-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-all duration-300">
                            <Megaphone strokeWidth={1.5} size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-800 transition-colors">
                            Policy Directives
                        </h3>

                        <p className="text-sm text-slate-600 mb-8 leading-relaxed flex-grow font-medium">
                            <span className="font-bold text-amber-600 block mb-1">AY 2024-25 Mandatory Update:</span>
                            One Time Registration (OTR) is required to file scholarship applications. Department Nodal Officers must ensure student compliance. See <Link to="/faqs" className="text-blue-600 hover:text-blue-800 hover:underline">OTR Guidelines</Link>.
                        </p>

                        <Link to="/announcements" className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm">
                            View Directives <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Nodal Officers Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col items-start relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent -z-10 opacity-60 group-hover:from-blue-50 transition-colors"></div>

                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-slate-100 border border-slate-200 text-slate-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-all duration-300">
                            <Users strokeWidth={1.5} size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-800 transition-colors">
                            Nodal Officers
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Scheme-Wise Directory</span>

                        <p className="text-sm text-slate-600 mb-8 leading-relaxed flex-grow font-medium">
                            Locate and contact the designated Nodal Officers assigned by the Department for oversight and verification of specific scholarship schemes.
                        </p>

                        <Link to="/officers/list" className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm">
                            Search Registry <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Grievance Redressal Officers Card */}
                    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col items-start relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent -z-10 opacity-60 group-hover:from-blue-50 transition-colors"></div>

                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-slate-100 border border-slate-200 text-slate-600 shadow-sm group-hover:scale-110 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-600 transition-all duration-300">
                            <ShieldCheck strokeWidth={1.5} size={28} />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-blue-800 transition-colors">
                            Grievance Officers
                        </h3>
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-3 block">Dispute Resolution</span>

                        <p className="text-sm text-slate-600 mb-8 leading-relaxed flex-grow font-medium">
                            Identify the official Grievance Redressal Officers (GROs) deployed to investigate and resolve disputes or escalated issues within the system.
                        </p>

                        <Link to="/officers/grievance-redressal" className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-slate-50 text-slate-700 border border-slate-200 hover:bg-white hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm">
                            Find Arbiter <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Authenticate Card (Now spanning full width or prominent position) */}
                    <div className="lg:col-span-3 bg-white rounded-2xl p-8 md:p-10 border border-blue-100 shadow-md shadow-blue-50 hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up mt-4" style={{ animationDelay: '400ms' }}>

                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-50 border border-blue-100 text-blue-600 shadow-sm shrink-0">
                                <KeyRound strokeWidth={1.5} size={32} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-blue-950 mb-2">Secure Authentication Node</h3>
                                <p className="text-slate-600 font-medium max-w-xl leading-relaxed">
                                    Official port of entry for registered Scheme Nodal Officers to administrate system parameters and execute secure verifications.
                                </p>
                            </div>
                        </div>

                        <Link to="/login" className="whitespace-nowrap inline-flex items-center justify-center px-8 py-4 rounded-xl text-sm font-bold uppercase tracking-widest bg-blue-900 text-white hover:bg-blue-800 border border-transparent shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all w-full md:w-auto">
                            Authenticate Identity <ShieldCheck size={18} className="ml-2" />
                        </Link>
                    </div>

                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
            @keyframes fadeInUp {from {opacity: 0; transform: translateY(20px); } to {opacity: 1; transform: translateY(0); } }
            .animate-fade-in-up {animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default Officers;
