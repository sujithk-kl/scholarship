import { useEffect, useState } from 'react';
import api, { SERVER_BASE_URL } from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';

import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
    FileText, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle,
    Bell, Sparkles, LayoutDashboard, Wallet, ArrowRight, ShieldCheck,
    UploadCloud, Landmark, FileDown
} from 'lucide-react';

const socket = io(SERVER_BASE_URL);

const getNotificationSubMessage = (status) => {
    switch (status) {
        case 'Approved': return 'Congratulations! Your scholarship is ready.';
        case 'Rejected': return 'We regret to inform you that your app was rejected.';
        case 'Under Review': return 'Great! Your app is now being reviewed by Admin.';
        case 'Query Raised': return 'Action Needed: Check the queries below.';
        default: return 'Your application progress has been updated.';
    }
};

const StudentDashboard = () => {
    const [application, setApplication] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false);

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [notification, setNotification] = useState(null);
    const [officialCampaigns, setOfficialCampaigns] = useState([]);
    const [myCampaigns, setMyCampaigns] = useState([]);

    const navigate = useNavigate();

    const fetchStatus = async () => {
        try {
            const { data } = await api.get('/student/status');
            setApplication(data.application);
            setDocuments(data.documents || []);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setApplication(null); // No application found, show form
            } else {
                console.error("Fetch Status Error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficialCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/campaigns');
            const official = data.filter(c => c.isOfficial);
            setOfficialCampaigns(official);
        } catch (error) {
            console.error('Failed to fetch official campaigns', error);
        }
    };

    const fetchMyCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/my');
            setMyCampaigns(data);
        } catch (error) {
            console.error('Failed to fetch my campaigns', error);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            await api.post('/student/withdraw', { amount: withdrawAmount });
            alert('Funds Withdrawn Successfully!');
            setWithdrawAmount('');
            fetchStatus();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Withdrawal Failed');
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchOfficialCampaigns();
        fetchMyCampaigns();

        const studentUser = localStorage.getItem('studentUser');
        const user = localStorage.getItem('user');
        const activeUser = studentUser ? JSON.parse(studentUser) : user ? JSON.parse(user) : null;

        if (activeUser && activeUser._id) {
            console.log('Joining socket room:', activeUser._id);
            socket.emit('join_room', activeUser._id);

            socket.on('status_update', (newStatus) => {
                console.log('Real-time status update received:', newStatus);
                setApplication(prev => prev ? ({ ...prev, currentStatus: newStatus }) : prev);

                setNotification({
                    message: `${newStatus}`,
                    subMessage: getNotificationSubMessage(newStatus),
                    type: newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info'
                });

                setTimeout(() => setNotification(null), 8000);

                fetchStatus();
                fetchMyCampaigns();
            });
        }

        return () => {
            socket.off('status_update');
        };
    }, []);

    // --------------------------------------------------------------------------
    // LOADING & ERROR STATES
    // --------------------------------------------------------------------------

    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center font-serif text-violet-900">
            <p className="border-b-2 border-violet-300 pb-2 animate-pulse tracking-widest uppercase text-sm font-bold">Synchronizing Data...</p>
        </div>
    );

    if (showSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 font-serif text-gray-900 selection:bg-emerald-500 selection:text-white">
                <div className="max-w-md w-full text-center bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl border border-white">
                    <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
                        <CheckCircle className="text-white" size={40} />
                    </div>
                    <h2 className="text-4xl font-normal mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-800">Application Submitted</h2>
                    <p className="text-gray-600 font-sans text-sm mb-12 leading-relaxed">
                        Your scholarship portal application has been securely recorded and is now queued for official verification by the review board.
                    </p>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            fetchStatus();
                        }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-sans font-bold hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all w-full uppercase tracking-widest text-xs"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isResubmitting || isRenewing) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-violet-500 selection:text-white">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => { setIsResubmitting(false); setIsRenewing(false); }}
                        className="mb-8 font-serif text-gray-500 hover:text-violet-600 transition-colors tracking-wide flex items-center gap-2 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </button>
                    <div className="animate-fade-in-up">
                        <ApplicationForm
                            initialData={application?.profile}
                            isResubmission={isResubmitting}
                            isRenewal={isRenewing}
                            onSuccess={() => {
                                setIsResubmitting(false);
                                setIsRenewing(false);
                                fetchStatus();
                            }}
                        />
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                `}} />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-violet-500 selection:text-white relative overflow-hidden">
                {/* Background Mesh */}
                <div className="absolute inset-0 bg-slate-50 -z-10"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-violet-200/40 rounded-full filter blur-[120px] -translate-y-1/2 translate-x-1/3 -z-10"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-200/40 rounded-full filter blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10"></div>

                <div className="max-w-4xl mx-auto">
                    <div className="mb-14 border-b border-gray-200 pb-8 relative">
                        <div className="absolute bottom-0 left-0 w-32 h-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full"></div>
                        <h1 className="font-serif text-5xl font-medium tracking-tight mb-4 text-gray-900">Student Profile Setup</h1>
                        <p className="text-gray-600 font-sans max-w-xl text-sm leading-relaxed">
                            To access institutional funding, please complete your detailed academic and financial profile below. Ensure all documentation matches official government records.
                        </p>
                    </div>

                    <div className="animate-fade-in-up">
                        <ApplicationForm onSuccess={() => {
                            setShowSuccess(true);
                            fetchStatus();
                        }} />
                    </div>
                </div>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                `}} />
            </div>
        );
    }

    // --------------------------------------------------------------------------
    // MAIN DASHBOARD (VIBRANT EDITORIAL LAYOUT)
    // --------------------------------------------------------------------------

    return (
        <div className="min-h-screen font-sans text-gray-900 selection:bg-violet-500 selection:text-white pb-20 relative overflow-hidden">
            {/* Background Layer: Subtle Animated Gradient Mesh */}
            <div className="fixed inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(248,250,252,1))] -z-20"></div>
            <div className="fixed top-0 right-0 w-[1000px] h-[800px] bg-indigo-100/50 rounded-full filter blur-[150px] -translate-y-1/4 translate-x-1/4 -z-10 absolute-center animation-pulse-slow"></div>
            <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-fuchsia-100/40 rounded-full filter blur-[120px] translate-y-1/4 -translate-x-1/4 -z-10"></div>

            {/* Vibrant Top Navigation */}
            <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-fuchsia-600 to-violet-600 text-white flex items-center justify-center font-serif text-xl shadow-lg shadow-violet-500/30">S</div>
                    <div>
                        <h1 className="text-xl font-serif tracking-tight leading-none mb-1 text-gray-900">Student Dashboard</h1>
                        <p className="text-[10px] font-sans font-bold text-violet-600 uppercase tracking-widest">Central Institutional Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={async () => {
                            if (confirm('DANGER: This action permanently deletes your application data. Proceed?')) {
                                try {
                                    await api.delete('/student/reset');
                                    window.location.reload();
                                } catch (error) {
                                    console.error("Failed to reset:", error);
                                    alert('Failed to reset');
                                }
                            }
                        }}
                        className="text-[10px] font-black text-gray-400 hover:text-rose-600 uppercase tracking-widest transition-colors py-2 px-3 rounded-lg hover:bg-rose-50"
                    >
                        Reset Data
                    </button>
                    <button
                        onClick={() => navigate('/student/recommendations')}
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all text-xs uppercase tracking-widest border border-blue-400/50"
                    >
                        <Sparkles size={14} className="animate-pulse" /> AI Matches
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* --- 1. Eligibility Banner (Vibrant) --- */}
                {application?.eligibilityStatus && (
                    <div className={`mb-12 rounded-[2rem] p-6 shadow-lg border relative overflow-hidden backdrop-blur-md transition-all ${application.eligibilityStatus === 'Eligible' ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900' :
                        application.eligibilityStatus === 'Not Eligible' ? 'border-rose-200 bg-rose-50/80 text-rose-900' :
                            'border-amber-200 bg-amber-50/80 text-amber-900'
                        }`}>
                        {/* Decorative background glow */}
                        <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-50 ${application.eligibilityStatus === 'Eligible' ? 'bg-emerald-300' :
                            application.eligibilityStatus === 'Not Eligible' ? 'bg-rose-300' : 'bg-amber-300'
                            }`}></div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                            <div>
                                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 opacity-70 ${application.eligibilityStatus === 'Eligible' ? 'text-emerald-700' :
                                    application.eligibilityStatus === 'Not Eligible' ? 'text-rose-700' : 'text-amber-700'
                                    }`}>System Audit Result</p>
                                <h3 className="font-serif text-3xl tracking-tight mb-2 font-medium">
                                    Status: {application.eligibilityStatus}
                                </h3>
                                <p className="text-sm font-sans opacity-80 max-w-xl leading-relaxed">
                                    Determined via automated cross-referencing of your provided academic and financial datasets.
                                </p>
                            </div>
                            {application.eligibilityStatus === 'Not Eligible' && (
                                <button
                                    onClick={() => navigate('/crowdfunding')}
                                    className="bg-gradient-to-r from-rose-500 to-orange-500 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 hover:-translate-y-1 transition-all text-xs uppercase tracking-widest whitespace-nowrap border border-rose-400"
                                >
                                    Start Crowdfund Campaign
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* --- 2. Action Required: Expired Documents --- */}
                {documents.some(d => d.verificationStatus === 'Expired' || d.reuploadRequired) && (
                    <div className="mb-12 rounded-[2rem] border border-rose-200 p-8 md:p-10 bg-gradient-to-br from-rose-50/90 to-red-50/50 shadow-xl shadow-rose-500/5 relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-600 to-red-600 text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">Critical Action</div>
                        <h3 className="font-serif text-3xl text-rose-800 tracking-tight mb-3 flex items-center gap-3">
                            <AlertCircle size={28} className="animate-pulse" /> Document Update
                        </h3>
                        <p className="text-rose-900/80 text-sm font-sans mb-8 leading-relaxed max-w-2xl">One or more verification documents in your file have expired. Immediate replacement is required to maintain funding eligibility and prevent automated AI suspension.</p>

                        <div className="flex flex-col gap-4 border-t border-rose-200/50 pt-8">
                            {documents.filter(d => d.verificationStatus === 'Expired' || d.reuploadRequired).map(doc => (
                                <div key={doc._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 p-5 rounded-2xl border border-rose-100">
                                    <div>
                                        <p className="font-bold text-sm tracking-wide text-gray-900">{doc.documentType}</p>
                                        <p className="text-rose-600 text-xs font-mono font-medium mt-1 bg-rose-100/50 inline-block px-2 py-0.5 rounded-md">Expired: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <label className="bg-gradient-to-r from-rose-500 to-red-500 text-white px-6 py-3 rounded-xl font-black shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 text-[11px] cursor-pointer transition-all uppercase tracking-widest flex items-center gap-2">
                                        <UploadCloud size={16} /> Upload Replacement
                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const fData = new FormData();
                                                fData.append('document', file);
                                                try {
                                                    await api.put(`/student/reupload/${doc._id}`, fData, {
                                                        headers: { 'Content-Type': 'multipart/form-data' }
                                                    });
                                                    alert(`${doc.documentType} uploaded successfully.`);
                                                    fetchStatus();
                                                } catch (error) {
                                                    console.error("Re-upload failed:", error);
                                                    alert('Re-upload failed');
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- 3. Main Document View --- */}
                <div className="mb-16">
                    <h2 className="font-serif text-4xl mb-8 tracking-tight border-b-2 border-gray-100 pb-4 text-gray-900 relative">
                        File Overview
                        <div className="absolute bottom-[-2px] left-0 w-24 h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500"></div>
                    </h2>

                    {/* Data Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-sans mb-12 text-sm">
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">Index ID</p>
                            <p className="font-mono text-gray-800 text-lg">{application._id.slice(-8)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">Category</p>
                            <p className="font-medium text-gray-800 text-lg">{application.applicationType}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">Submitted</p>
                            <p className="font-medium text-gray-800 text-lg">{new Date(application.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center">
                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">Current State</p>
                            <div className="flex items-center">
                                <StatusBadge status={application.currentStatus} />
                            </div>
                        </div>
                    </div>

                    <div className="my-12 rounded-[2rem] border border-gray-100 p-8 md:p-10 bg-white/80 backdrop-blur-sm shadow-xl shadow-gray-200/20">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6">Verification Timeline</p>
                        <StatusTimeline currentStatus={application?.currentStatus} />
                    </div>

                    {/* FINTECH WALLET SECTION (Midnight Sapphire / Glasscard Style) */}
                    {application.currentStatus === 'Approved' && (
                        <div className="mb-14 rounded-[2.5rem] bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden relative group">
                            {/* Glassmorphic Shine Effects */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-400/20 transition-colors duration-700"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/20 rounded-full filter blur-[80px] translate-y-1/3 -translate-x-1/4"></div>

                            <div className="text-white p-8 md:p-12 flex flex-col md:flex-row justify-between gap-10 items-end relative z-10 box-border">
                                <div className="w-full md:w-auto">
                                    <p className="text-[11px] font-black text-blue-300 uppercase tracking-widest mb-4 flex items-center gap-2"><Wallet size={16} /> Ledger Funding Allocation</p>
                                    <p className="font-serif text-7xl tracking-tighter mb-6 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                                        ₹{((application.scholarshipAmount || 0) - (application.withdrawnAmount || 0)).toLocaleString()}
                                    </p>
                                    <div className="flex flex-wrap gap-8 text-sm font-sans tracking-wide bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                        <div><span className="text-indigo-200/70 text-xs uppercase tracking-wider block mb-1">Total Granted</span> <span className="font-mono text-lg text-white">₹{application.scholarshipAmount?.toLocaleString()}</span></div>
                                        <div className="w-px bg-white/10 hidden sm:block"></div>
                                        <div><span className="text-indigo-200/70 text-xs uppercase tracking-wider block mb-1">Withdrawn</span> <span className="font-mono text-lg text-white">₹{application.withdrawnAmount?.toLocaleString() || 0}</span></div>
                                    </div>
                                    <p className="text-xs font-mono text-indigo-300/60 mt-6 max-w-sm flex items-center gap-2 bg-indigo-950/50 p-3 rounded-xl border border-indigo-500/20">
                                        <Landmark size={14} className="text-indigo-400" /> Route: {application.profile?.financialDetails?.bankAccountNo || 'UNLINKED'}
                                    </p>
                                </div>

                                <div className="w-full md:w-80 mt-8 md:mt-0">
                                    {(application.withdrawalStatus === 'Available' || application.withdrawalStatus === 'Partially Withdrawn') ? (
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl">
                                            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-5">Execute Transfer</p>
                                            <div className="flex border-b-2 border-indigo-400/50 focus-within:border-emerald-400 transition-colors pb-1">
                                                <div className="py-2 text-emerald-300 font-serif text-2xl border-none pl-2">₹</div>
                                                <input
                                                    type="number"
                                                    placeholder="Amount"
                                                    min="1"
                                                    value={withdrawAmount}
                                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                                    className="w-full bg-transparent border-none text-white font-serif text-3xl px-3 py-2 outline-none placeholder-indigo-300/30"
                                                />
                                            </div>
                                            <button
                                                onClick={handleWithdraw}
                                                className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:from-emerald-400 hover:to-teal-300 px-4 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 border border-emerald-400/50 flex justify-center items-center gap-2"
                                            >
                                                Authorize Withdrawal <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    ) : application.withdrawalStatus === 'Fully Withdrawn' ? (
                                        <div className="border border-white/10 p-8 rounded-3xl text-center bg-white/5 backdrop-blur-md">
                                            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle className="text-emerald-400" size={32} strokeWidth={1.5} />
                                            </div>
                                            <p className="font-serif text-2xl tracking-tight text-white mb-2">Transfer Complete</p>
                                            <p className="text-[10px] uppercase tracking-widest text-indigo-300/70">Funds Exhausted</p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {application.withdrawalStatus === 'Fully Withdrawn' && (
                                <div className="border-t border-indigo-500/30 p-6 bg-indigo-950/80 backdrop-blur-md flex justify-between items-center relative z-10 text-white">
                                    <p className="font-serif text-lg text-indigo-100 flex items-center gap-2"><RefreshCw size={18} className="text-indigo-300" /> Academic Renewal Window Open</p>
                                    <button
                                        onClick={() => setIsRenewing(true)}
                                        className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                                    >
                                        Initiate Renewal <ArrowRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Active Queries (Vibrant Card) */}
                    {application.queries && application.queries.length > 0 && (
                        <div className="mb-14 rounded-[2rem] border border-amber-200 shadow-xl shadow-amber-500/5 p-8 md:p-10 bg-gradient-to-br from-amber-50/80 to-yellow-50/40 relative overflow-hidden">
                            <h3 className="font-serif text-2xl tracking-tight mb-8 flex items-center gap-3 text-amber-900 border-b border-amber-200/50 pb-4">
                                <AlertCircle size={24} className="text-amber-500" /> Annotations & Queries (<span className="font-sans font-bold bg-amber-200/50 text-amber-700 px-3 py-1 rounded-lg text-lg leading-none">{application.queries.length}</span>)
                            </h3>
                            <div className="space-y-8">
                                {application.queries.map((q, i) => (
                                    <div key={i} className="bg-white/60 p-6 rounded-2xl border border-amber-100 backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="font-bold text-base text-gray-900 tracking-wide">{q.queryTitle}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md border ${q.status === 'Open' ? 'border-amber-400 bg-amber-100 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-600'}`}>
                                                {q.status}
                                            </span>
                                        </div>
                                        <p className="font-serif text-gray-800 text-lg leading-relaxed max-w-3xl">{q.queryMessage}</p>
                                        {q.response && (
                                            <div className="mt-5 bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border-l-4 border-emerald-400 text-base font-serif italic text-gray-700 shadow-sm transition-all hover:translate-x-1">
                                                " {q.response} "
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {application.queries.some(q => q.status === 'Open') && (
                                <button
                                    onClick={() => setIsResubmitting(true)}
                                    className="mt-10 bg-amber-500 hover:bg-amber-400 text-white px-8 py-4 rounded-xl font-black shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-1 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto sm:mx-0 w-full md:w-auto"
                                >
                                    Append Response & Resubmit <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Document Vault List (Vibrant) */}
                    <div className="mt-14 mb-20 bg-white rounded-[2rem] border border-gray-100 p-8 md:p-10 shadow-xl shadow-gray-200/20 relative">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full filter blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>

                        <h3 className="font-serif text-3xl tracking-tight mb-8 text-gray-900 border-b border-gray-100 pb-4 relative">
                            Document Registry
                            <div className="absolute bottom-[-1px] left-0 w-16 h-[2px] bg-indigo-400"></div>
                        </h3>
                        <div className="space-y-4 pt-2">
                            {documents?.length > 0 ? documents.map(doc => (
                                <div key={doc._id} className="bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-md p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 group transition-all duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-500 flex items-center justify-center group-hover:scale-110 group-hover:from-indigo-500 group-hover:to-violet-500 group-hover:text-white transition-all">
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-900 block mb-0.5">{doc.documentType}</span>
                                            <span className="text-xs text-gray-400 font-mono">ID: {doc._id?.slice(-6) || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 self-end sm:self-auto">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${doc.verificationStatus === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            doc.verificationStatus === 'Rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {doc.verificationStatus}
                                        </span>
                                        <a
                                            href={`${SERVER_BASE_URL}${doc.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            View <ArrowRight size={12} />
                                        </a>
                                    </div>
                                </div>
                            )) : (
                                <div className="py-12 text-center bg-gray-50 border border-dashed border-gray-200 rounded-2xl">
                                    <FileDown size={32} className="text-gray-300 mx-auto mb-3" />
                                    <p className="font-serif italic text-gray-500 text-lg">No documents registered in current file.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- 4. Personal Crowdfunding (Sunset Gradient) --- */}
                {myCampaigns.filter(c => c.status === 'Active').length > 0 && (
                    <div className="mb-20">
                        <h2 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-6 text-center lg:text-left flex items-center gap-2 justify-center lg:justify-start">
                            <Sparkles size={14} /> External Funding Mechanism
                        </h2>
                        {myCampaigns.filter(c => c.status === 'Active').map((campaign) => (
                            <div key={campaign._id} className="rounded-[2.5rem] border border-orange-200 bg-gradient-to-br from-orange-50/80 via-white to-rose-50/80 p-8 md:p-12 shadow-xl shadow-orange-500/10 mb-8 relative overflow-hidden backdrop-blur-sm">
                                {/* Decorative elements */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-rose-400 rounded-full filter blur-[60px] opacity-20"></div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400"></div>

                                <h3 className="font-serif text-4xl md:text-5xl tracking-tight mb-5 max-w-2xl text-gray-900 leading-[1.1]">
                                    "{campaign.title}"
                                </h3>
                                <p className="font-sans text-lg text-gray-700 mb-12 max-w-2xl leading-relaxed">
                                    {campaign.story}
                                </p>

                                <div className="bg-white/60 p-6 md:p-8 rounded-[2rem] border border-orange-100 flex flex-wrap md:flex-nowrap justify-between gap-8 mb-8 backdrop-blur-md shadow-sm">
                                    <div className="w-full sm:w-auto">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                                        <p className="font-bold text-gray-900 flex items-center gap-2"><span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span></span> Active</p>
                                    </div>
                                    <div className="w-px bg-orange-200/50 hidden md:block"></div>
                                    <div className="w-1/2 sm:w-auto">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Backers</p>
                                        <p className="font-black text-2xl text-gray-900">{campaign.donors?.length || 0}</p>
                                    </div>
                                    <div className="w-px bg-orange-200/50 hidden sm:block"></div>
                                    <div className="w-1/2 sm:w-auto">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Raised</p>
                                        <p className="font-black font-serif text-3xl text-orange-600 drop-shadow-sm">₹{campaign.raisedAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="w-px bg-orange-200/50 hidden md:block"></div>
                                    <div className="w-full sm:w-auto">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Target Goal</p>
                                        <p className="font-medium font-serif text-2xl text-gray-500 border-b border-gray-300 border-dashed pb-1 inline-block">₹{campaign.goalAmount?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-orange-600">Funding Progress</span>
                                        <span className="text-xl font-serif font-medium text-gray-900">{Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%</span>
                                    </div>
                                    <div className="h-3 bg-white/80 rounded-full w-full overflow-hidden border border-orange-100 shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-rose-500 rounded-full transition-all duration-1000 ease-out relative"
                                            style={{ width: `${Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100)}%` }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }

                {/* --- 5. Official Sponsorships (Vibrant Grid) --- */}
                {
                    officialCampaigns.length > 0 && (
                        <div className="border-t-2 border-indigo-100 pt-16">
                            <div className="mb-10 text-center lg:text-left">
                                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block">Official Network</span>
                                <h2 className="font-serif text-4xl tracking-tight text-gray-900">Institutional Synergies</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {officialCampaigns.map((campaign) => (
                                    <div
                                        key={campaign._id}
                                        className="group cursor-pointer bg-white rounded-[2rem] border border-gray-100 p-8 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                                        onClick={() => navigate('/crowdfunding')}
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-2 border border-indigo-200 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg">
                                                    <ShieldCheck size={14} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Approved Directive</span>
                                                </div>
                                                <span className="font-serif text-2xl tracking-tight text-gray-900">₹{campaign.goalAmount?.toLocaleString()}</span>
                                            </div>
                                            <h3 className="font-serif text-2xl tracking-tight mb-4 text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">{campaign.title}</h3>
                                            <p className="font-sans text-sm text-gray-600 line-clamp-3 leading-relaxed mb-8">{campaign.story}</p>
                                        </div>
                                        <div className="border-t border-gray-100 pt-5 flex justify-between items-center group-hover:border-indigo-100 transition-colors">
                                            <div className="flex items-center gap-[-8px]">
                                                {/* Fake overlapping avatars for visual interest */}
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 border-2 border-white flex justify-center items-center text-[10px] text-white font-bold blur-[0.5px]">A</div>
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 border-2 border-white flex justify-center items-center text-[10px] text-white font-bold -ml-3 blur-[0.5px]">B</div>
                                                <span className="text-xs font-bold text-gray-500 ml-3">+{campaign.donors?.length || 0} Participants</span>
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center gap-1">Read File <ArrowRight size={14} className="group-hover:animate-bounce-x" /></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            </main >

            {/* Vibrant Modern Notification Popup */}
            {
                notification && (
                    <div className="fixed bottom-8 right-8 z-[100] animate-slide-in-up">
                        <div className="bg-gray-900 text-white p-6 rounded-2xl w-80 shadow-2xl shadow-black/40 border border-gray-700 backdrop-blur-xl bg-opacity-95 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 ${notification.type === 'success' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : notification.type === 'error' ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'}`}></div>
                            <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-800">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5"><Bell size={12} className="animate-pulse" /> System Intercept</span>
                                <button onClick={() => setNotification(null)} className="text-gray-500 hover:text-white transition-colors"><XCircle size={16} /></button>
                            </div>
                            <h4 className="font-serif text-2xl tracking-tight mb-2 text-white">{notification.message}</h4>
                            <p className="font-sans text-sm text-gray-400 leading-relaxed capitalize">{notification.subMessage}</p>
                        </div>
                    </div>
                )
            }

            {/* Typography/Animation Utilities */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-in-up {
                    0% { transform: translateY(120%) scale(0.9); opacity: 0; }
                    10% { transform: translateY(0) scale(1.05); opacity: 1; }
                    15% { transform: translateY(0) scale(1); }
                    90% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(120%) scale(0.9); opacity: 0; }
                }
                .animate-slide-in-up {
                    animation: slide-in-up 8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
                .animation-pulse-slow {
                    animation: pulse-slow 10s ease-in-out infinite;
                }
                @keyframes bounce-x {
                    0%, 100% { transform: translateX(0); }
                    50% { transform: translateX(3px); }
                }
                .animate-bounce-x {
                    animation: bounce-x 1s infinite relative;
                }
            `}} />
        </div>
    );
};

export default StudentDashboard;
