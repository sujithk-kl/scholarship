import React from 'react';
import Navbar from '../components/Navbar';
import { Target, CheckCircle2, ShieldCheck, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    const objectives = [
        {
            title: "Direct Benefit Transfer (DBT)",
            desc: "Ensure 100% timely disbursement of scholarships directly to validated beneficiaries without intermediary leakage.",
            icon: Zap
        },
        {
            title: "Unified Database Architecture",
            desc: "Create a centralized, transparent registry of all scholarship schemes and beneficiaries across different departments.",
            icon: Globe
        },
        {
            title: "Aadhaar-Based Authentication",
            desc: "Eliminate duplication and systemic fraud through mandatory cryptographic demographic verification protocols.",
            icon: ShieldCheck
        },
        {
            title: "Scheme Harmonization",
            desc: "Consolidate divergent scholarship policies under a single operational umbrella for streamlined public access.",
            icon: Target
        },
        {
            title: "Real-Time Tracking",
            desc: "Provide instantaneous status telemetry for applications affecting both student transparency and administrative oversight.",
            icon: CheckCircle2
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
            <Navbar />

            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full filter blur-[100px] -translate-y-1/2 -translate-x-1/3 -z-10"></div>

            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative animate-fade-in-up">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent -z-10 opacity-70"></div>

                    <div className="p-8 md:p-12 lg:p-16">

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-950 mb-3">About Us</h1>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Platform Telemetry & Architecture</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                <Globe size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
                            <div className="space-y-6">
                                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                    The <strong className="text-blue-900">Smart Scholarship Portal</strong> is a state-of-the-art digital infrastructure conceptualized to revolutionize the administration and disbursal of educational grants. Recognizing systemic structural barriers, this platform acts as the definitive bridge connecting verified institutional funds with deserving candidates.
                                </p>
                                <p className="text-slate-600 leading-relaxed">
                                    Our operational architecture integrates cryptographic verification mechanisms to guarantee precise capital allocation. By migrating the entire procedural lifecycle online, we have systematically eliminated redundant paperwork and physical friction points, allowing applicants to focus entirely on their scholastic endeavors.
                                </p>
                            </div>

                            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
                                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors z-10"></div>
                                <img
                                    src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                    alt="Students Studying"
                                    className="w-full h-full object-cover aspect-video lg:aspect-square filter grayscale group-hover:grayscale-0 transition-all duration-700"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.insertAdjacentHTML('afterbegin', '<div class="w-full h-full aspect-video lg:aspect-square bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">Image Unavailable</div>');
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Core Operational Objectives</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {objectives.map((obj, idx) => (
                                    <div key={idx} className={`bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-blue-200 hover:shadow-md transition-all group ${idx === objectives.length - 1 ? 'md:col-span-2 md:w-1/2 md:mx-auto' : ''}`}>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-blue-200 group-hover:text-blue-600 transition-all text-slate-400">
                                                <obj.icon size={18} strokeWidth={2} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800 mb-2 group-hover:text-blue-900 transition-colors uppercase tracking-wide">{obj.title}</h3>
                                                <p className="text-xs text-slate-500 font-medium leading-relaxed">{obj.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};
export default About;
