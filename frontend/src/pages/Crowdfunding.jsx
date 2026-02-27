import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, HeartPulse, Building2, UserPlus, FileText, ChevronRight, Activity, Globe, DollarSign, Award, ArrowLeft } from 'lucide-react';

const Crowdfunding = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [donateModal, setDonateModal] = useState(null);
    const [globalStats, setGlobalStats] = useState({ totalActive: 0, totalRaised: 0, totalDonors: 0 });
    const [fundedCampaigns, setFundedCampaigns] = useState([]);

    // Create Campaign Form
    const [newCampaign, setNewCampaign] = useState({ title: '', story: '', goalAmount: '', courseName: '', instituteName: '', category: 'Education' });

    // Donate Form
    const [donorForm, setDonorForm] = useState({ name: '', email: '', amount: '', isAnonymous: false, message: '' });

    useEffect(() => {
        fetchCampaigns();
        fetchGlobalStats();
        fetchFundedCampaigns();
    }, []);

    const fetchGlobalStats = async () => {
        try {
            const { data } = await api.get('/crowdfund/stats');
            setGlobalStats(data);
        } catch (err) {
            console.error('Error fetching global stats', err);
        }
    };

    const fetchFundedCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/funded');
            setFundedCampaigns(data);
        } catch (err) {
            console.error('Error fetching funded campaigns', err);
        }
    };

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/campaigns');
            setCampaigns(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCampaign = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/crowdfund/campaign', newCampaign);
            alert('Campaign created successfully!');
            setShowCreateForm(false);
            setNewCampaign({ title: '', story: '', goalAmount: '', courseName: '', instituteName: '', category: 'Education' });
            fetchCampaigns();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error creating campaign';
            alert(errorMsg);
        }
    };

    const handleDonate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post(`/crowdfund/donate/${donateModal._id}`, donorForm);
            alert(data.message);
            setDonateModal(null);
            setDonorForm({ name: '', email: '', amount: '', isAnonymous: false, message: '' });
            fetchCampaigns();
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Error processing donation';
            alert(errorMsg);
        }
    };

    const progressPercent = (raised, goal) => Math.min(Math.round((raised / goal) * 100), 100);

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-blue-900">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="tracking-widest uppercase text-sm font-semibold text-slate-500">Initializing Funding Environment...</p>
        </div>
    );

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white pb-20 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>

            {/* Top Navigation Panel mimicking dashboards */}
            <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-sm group">
                            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                                <Globe size={20} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-blue-950 leading-none mb-1">Corporate Social Responsibility</h1>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Public Sponsorship Network</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section Reimagined */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-up">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-950 mb-6 tracking-tight leading-tight">
                            Philanthropic <span className="text-blue-600">Sponsorship</span> Initiative
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-lg mb-8 font-medium">
                            Facilitating direct intervention for deserving students. NGO donors and Corporate Social Responsibility partners can transparently fund verified academic candidates through this secure administrative framework.
                        </p>

                        <div className="flex flex-wrap gap-4 items-center">
                            {(user?.role === 'Student' || user?.role === 'Admin') && (
                                <button
                                    onClick={() => setShowCreateForm(!showCreateForm)}
                                    className="bg-blue-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-800 transition-all shadow-lg hover:shadow-blue-900/20 hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    {user?.role === 'Admin' ? 'Authorize Official Campaign' : 'Initialize Direct Request'}
                                </button>
                            )}
                            <div className="bg-white border border-slate-200 px-6 py-4 rounded-xl shadow-sm flex items-center gap-3">
                                <Activity size={20} className="text-emerald-500" />
                                <div>
                                    <p className="text-lg font-bold text-slate-800 leading-none">{globalStats.totalActive}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Projects</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard Grid for Hero */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent -z-10"></div>
                            <DollarSign size={24} className="text-emerald-600 mb-4" />
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">₹{globalStats.totalRaised.toLocaleString()}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gross Capital Deployed</p>
                        </div>
                        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent -z-10"></div>
                            <UserPlus size={24} className="text-indigo-600 mb-4" />
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{globalStats.totalDonors}</h3>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authenticated Sponsors</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Create Campaign Form */}
                {showCreateForm && (user?.role === 'Student' || user?.role === 'Admin') && (
                    <div className="mb-12 bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-10 animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                            <FileText size={24} className="text-blue-600" />
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                    {user?.role === 'Admin' ? 'System Sponsor Initialization' : 'Candidate Requisition Form'}
                                </h2>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Data Entry Protocol</p>
                            </div>
                        </div>
                        <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Subject Nomenclature</label>
                                <input type="text" placeholder="Enter Campaign Title" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Target Capital Deficit (₹)</label>
                                <input type="number" placeholder="Enter Goal Amount" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors" value={newCampaign.goalAmount} onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Academic Classification</label>
                                <input type="text" placeholder="Degree / Course Identifier" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors" value={newCampaign.courseName} onChange={(e) => setNewCampaign({ ...newCampaign, courseName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Institutional Anchor</label>
                                <input type="text" placeholder="Registered Institute Name" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors" value={newCampaign.instituteName} onChange={(e) => setNewCampaign({ ...newCampaign, instituteName: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sector Category</label>
                                <select className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors appearance-none" value={newCampaign.category} onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}>
                                    <option value="Education">Education & Academia</option>
                                    <option value="Medical">Medical Intervention</option>
                                    <option value="Research">Research & Development</option>
                                    <option value="Arts">Vocational & Arts</option>
                                    <option value="Other">Unclassified</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Background Dossier / Justification</label>
                                <textarea placeholder="Provide detailed rationale and circumstances requiring philanthropic intervention." className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm font-medium text-slate-800 bg-slate-50 transition-colors block resize-none custom-scrollbar" rows={5} value={newCampaign.story} onChange={(e) => setNewCampaign({ ...newCampaign, story: e.target.value })} required />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-bold uppercase text-xs tracking-widest transition-colors">Abort Initialization</button>
                                <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-blue-800 shadow-lg hover:shadow-blue-900/20 transition-all flex items-center gap-2">Execute Request <ChevronRight size={14} /></button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Campaign Cards */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight flex items-center gap-2">
                        <Activity size={20} className="text-blue-600" /> Active Disbursal Requests
                    </h3>
                    {campaigns.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <ShieldCheck size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium text-lg">System registers zero active campaigns.</p>
                            <p className="text-slate-400 text-sm mt-1">Awaiting data entry protocols.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {campaigns.map((campaign, index) => (
                                <div key={campaign._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>

                            {/* Card Header */}
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="bg-white border border-slate-200 text-slate-600 shadow-sm text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-widest">{campaign.category}</span>
                                    {campaign.isOfficial && (
                                        <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] px-2 py-1 rounded font-black flex items-center gap-1 shadow-sm uppercase tracking-widest">
                                            <ShieldCheck size={12} /> Govt Auth
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-slate-800 text-lg font-bold leading-tight group-hover:text-blue-800 transition-colors">{campaign.title}</h3>
                                <p className="text-slate-500 text-xs font-medium mt-2 flex items-center gap-1.5">
                                    <Building2 size={12} className="text-slate-400" />
                                    {campaign.isOfficial ? 'System Sponsored' : (campaign.student?.name || 'Unverified Applicant')}
                                </p>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex-grow flex flex-col">
                                <p className="text-slate-600 text-sm line-clamp-3 mb-6 font-medium leading-relaxed flex-grow">{campaign.story}</p>

                                {/* Progress Bar Module */}
                                <div className="mt-auto pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-end mb-2">
                                        <div>
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Deficit Raised</span>
                                            <span className="font-bold text-lg text-emerald-600 leading-none">₹{campaign.raisedAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Target Cap</span>
                                            <span className="text-sm font-bold text-slate-700">₹{campaign.goalAmount?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                            style={{ width: `${progressPercent(campaign.raisedAmount, campaign.goalAmount)}%` }}
                                                ></div>
                                </div>
                                <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>{progressPercent(campaign.raisedAmount, campaign.goalAmount)}% Yield</span>
                                    <span>{campaign.donors?.length || 0} Actors</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => setDonateModal(campaign)}
                                className="mt-6 w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-md active:scale-[0.98] border border-slate-700"
                            >
                                Process Transfer
                            </button>
                        </div>
                                </div>
                            ))}
        </div>
    )
}
                </div >

    {/* Recently Funded Success Stories (Restyled) */ }
{
    fundedCampaigns.length > 0 && (
        <div className="mt-20 mb-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6 tracking-tight flex items-center gap-2">
                <Award size={20} className="text-blue-600" /> Settled Requisitions Log
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fundedCampaigns.map((campaign, index) => (
                    <div
                        key={campaign._id}
                        onClick={() => setSelectedCampaign(campaign)}
                        className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden cursor-pointer group hover:border-blue-200 transition-all animate-fade-in-up"
                        style={{ animationDelay: `${index * 150}ms` }}
                                >
                <div className="absolute top-0 right-0 bg-emerald-50 border-b border-l border-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1.5 rounded-bl-xl uppercase tracking-widest flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={10} /> Target Hit
                </div>
                <h3 className="font-bold text-slate-800 mb-2 mt-2 group-hover:text-blue-800 transition-colors pr-20">{campaign.title}</h3>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2 font-medium leading-relaxed">{campaign.story}</p>
                <div className="flex justify-between items-center text-xs mt-auto pt-4 border-t border-slate-100">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Avg: ₹{campaign.goalAmount?.toLocaleString()}</span>
                    <span className="text-slate-500 font-medium bg-slate-50 border border-slate-200 px-2 py-1 rounded">Via {campaign.donors?.length || 0} Entities</span>
                </div>
            </div>
                            ))}
        </div>
                    </div >
                )
}
            </main >

    {/* Donate Modal (Corporate Redesign) */ }
{
    donateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Transfer Authorization</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Secure Funding Protocol</p>
                    </div>
                    <button onClick={() => setDonateModal(null)} className="text-slate-400 hover:text-slate-600 text-2xl font-light leading-none p-2 bg-slate-50 rounded-lg">×</button>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                    <span className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Target Subject</span>
                    <strong className="text-blue-900 text-sm">{donateModal.title}</strong>
                </div>

                <form onSubmit={handleDonate} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Entity Name</label>
                        <input type="text" placeholder="Corporate / Individual Identifier" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 outline-none text-sm font-medium text-slate-800 transition-colors" value={donorForm.name} onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Communication Ping</label>
                        <input type="email" placeholder="Contact Address" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 outline-none text-sm font-medium text-slate-800 transition-colors" value={donorForm.email} onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Transfer Value (₹)</label>
                        <input type="number" placeholder="Determine Amount" className="w-full border-2 border-emerald-100 bg-emerald-50/30 p-3.5 rounded-xl focus:border-emerald-500 outline-none text-sm font-bold text-emerald-800 transition-colors" value={donorForm.amount} onChange={(e) => setDonorForm({ ...donorForm, amount: e.target.value })} required />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Appended Memo (Optional)</label>
                        <textarea placeholder="Note for the ledger" className="w-full border-2 border-slate-200 p-3.5 rounded-xl focus:border-blue-500 outline-none text-sm font-medium text-slate-800 transition-colors resize-none" rows={2} value={donorForm.message} onChange={(e) => setDonorForm({ ...donorForm, message: e.target.value })} />
                    </div>

                    <label className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" checked={donorForm.isAnonymous} onChange={(e) => setDonorForm({ ...donorForm, isAnonymous: e.target.checked })} />
                        Execute Anonymously
                    </label>

                    <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-slate-800 shadow-md shadow-slate-200 mt-2 transition-all">
                        Approve & Execute Transfer
                    </button>
                </form>
            </div>
        </div>
    )
}

{/* View Detail Modal (Corporate Redesign) */ }
{
    selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 relative hide-scrollbar">

                <button onClick={() => setSelectedCampaign(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors">
                    <ArrowLeft size={20} className="rotate-180" />
                </button>

                <div className="mb-10 pr-12">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border mb-4 ${selectedCampaign.status === 'Funded' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {selectedCampaign.status === 'Funded' ? <ShieldCheck size={12} /> : <Activity size={12} />}
                    Status: {selectedCampaign.status}
                </span>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight mb-2">{selectedCampaign.title}</h2>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest border border-slate-200 bg-slate-50 px-2 py-0.5 rounded text-slate-400">ID: {selectedCampaign._id.slice(-8)}</span>
                    Beneficiary: {selectedCampaign.student?.name || 'Unverified System Entity'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText size={14} className="text-blue-500" /> Dossier Details
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                            {selectedCampaign.story}
                        </div>
                    </div>

                    {selectedCampaign.courseName && (
                        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shrink-0">
                                <Award size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Academic Pathway</p>
                                <p className="text-sm font-bold text-slate-800">{selectedCampaign.courseName}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{selectedCampaign.instituteName}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Ledger Status</h3>
                        <div className="mb-2">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cleared Value</span>
                            <p className="text-3xl font-bold text-emerald-600 leading-none">₹{selectedCampaign.raisedAmount?.toLocaleString()}</p>
                        </div>
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <span className="text-sm text-slate-500 font-bold">Target limit: ₹{selectedCampaign.goalAmount?.toLocaleString()}</span>
                        </div>

                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                style={{ width: `${progressPercent(selectedCampaign.raisedAmount, selectedCampaign.goalAmount)}%` }}
                                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{progressPercent(selectedCampaign.raisedAmount, selectedCampaign.goalAmount)}% Yield</span>
                        <span>{selectedCampaign.donors?.length || 0} Entities</span>
                    </div>

                    {selectedCampaign.status === 'Active' && (
                        <button
                            onClick={() => {
                                setDonateModal(selectedCampaign);
                                setSelectedCampaign(null);
                            }}
                            className="mt-8 w-full bg-slate-900 border border-slate-800 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            Execute Transfer <ChevronRight size={14} />
                        </button>
                    )}
                </div>

                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Globe size={14} className="text-indigo-500" /> Authorized Transactors
                    </h3>
                    <div className="space-y-4 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
                        {selectedCampaign.donors?.slice(0, 5).map((donor, i) => (
                            <div key={i} className="flex justify-between items-start gap-4 border-b border-slate-200/50 pb-3 last:border-0 last:pb-0">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-800">{donor.name}</p>
                                    {donor.message && <p className="text-[10px] text-slate-500 italic mt-0.5 leading-tight">"{donor.message}"</p>}
                                </div>
                                <p className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shrink-0">₹{donor.amount}</p>
                            </div>
                        ))}
                        {(!selectedCampaign.donors || selectedCampaign.donors.length === 0) && (
                            <p className="text-xs text-center text-slate-400 font-medium py-4">No logged transactions found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
                    </div >
                </div >
            )
}

<style dangerouslySetInnerHTML={{
    __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default Crowdfunding;
