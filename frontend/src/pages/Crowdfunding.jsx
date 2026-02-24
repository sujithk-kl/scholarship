import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">Loading campaigns...</p>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white py-12">
                <div className="container mx-auto px-4 md:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">🤝 Scholarship Crowdfunding</h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6">
                        Help deserving students achieve their dreams. NGO donors and CSR partners can transparently sponsor
                        students who need financial support for their education.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {(user?.role === 'Student' || user?.role === 'Admin') && (
                            <button
                                onClick={() => setShowCreateForm(!showCreateForm)}
                                className="bg-white text-amber-700 px-6 py-3 rounded-lg font-bold hover:bg-amber-50 transition shadow-lg"
                            >
                                {user?.role === 'Admin' ? '🚀 Create Official Campaign' : '🚀 Start a Campaign'}
                            </button>
                        )}
                        <div className="bg-white/20 px-6 py-3 rounded-lg font-bold">
                            {globalStats.totalActive} Active Campaigns
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 py-8">
                {/* Create Campaign Form */}
                {showCreateForm && (user?.role === 'Student' || user?.role === 'Admin') && (
                    <div className="mb-8 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {user?.role === 'Admin' ? 'Create Official Sponsored Campaign' : 'Create Your Campaign'}
                        </h2>
                        <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Campaign Title" className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={newCampaign.title} onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })} required />
                            <input type="number" placeholder="Goal Amount (₹)" className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={newCampaign.goalAmount} onChange={(e) => setNewCampaign({ ...newCampaign, goalAmount: e.target.value })} required />
                            <input type="text" placeholder="Course Name" className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={newCampaign.courseName} onChange={(e) => setNewCampaign({ ...newCampaign, courseName: e.target.value })} />
                            <input type="text" placeholder="Institute Name" className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={newCampaign.instituteName} onChange={(e) => setNewCampaign({ ...newCampaign, instituteName: e.target.value })} />
                            <select className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" value={newCampaign.category} onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value })}>
                                <option value="Education">Education</option>
                                <option value="Medical">Medical</option>
                                <option value="Research">Research</option>
                                <option value="Sports">Sports</option>
                                <option value="Arts">Arts</option>
                                <option value="Other">Other</option>
                            </select>
                            <div></div>
                            <textarea placeholder="Your story — why do you need support?" className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none md:col-span-2" rows={4} value={newCampaign.story} onChange={(e) => setNewCampaign({ ...newCampaign, story: e.target.value })} required />
                            <div className="md:col-span-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowCreateForm(false)} className="px-6 py-2 rounded-lg border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="bg-amber-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-amber-700 shadow-lg">Create Campaign</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Campaign Cards */}
                {campaigns.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-400 text-xl">No active campaigns yet.</p>
                        <p className="text-gray-400 mt-2">Be the first to start one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(campaign => (
                            <div key={campaign._id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                                {/* Card Header */}
                                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                                    <div className="flex justify-between items-start">
                                        <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold uppercase">{campaign.category}</span>
                                        {campaign.isOfficial && (
                                            <span className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
                                                🛡️ OFFICIAL
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-white text-lg font-bold mt-2">{campaign.title}</h3>
                                    <p className="text-white/70 text-sm mt-1">
                                        {campaign.isOfficial ? 'Sponsored by Govt/Admin' : `by ${campaign.student?.name || 'Anonymous Student'}`}
                                    </p>
                                </div>

                                {/* Card Body */}
                                <div className="p-5">
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{campaign.story}</p>

                                    {campaign.courseName && (
                                        <p className="text-xs text-gray-500 mb-1">📚 {campaign.courseName} {campaign.instituteName ? `at ${campaign.instituteName}` : ''}</p>
                                    )}

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-bold text-green-600">₹{campaign.raisedAmount?.toLocaleString()}</span>
                                            <span className="text-gray-500">of ₹{campaign.goalAmount?.toLocaleString()}</span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                                                style={{ width: `${progressPercent(campaign.raisedAmount, campaign.goalAmount)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                                            <span>{progressPercent(campaign.raisedAmount, campaign.goalAmount)}% funded</span>
                                            <span>{campaign.donors?.length || 0} donors</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <button
                                        onClick={() => setDonateModal(campaign)}
                                        className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold text-sm hover:from-green-600 hover:to-emerald-700 transition-all shadow-md shadow-green-100 active:scale-[0.98]"
                                    >
                                        💚 Donate Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Recently Funded / Success Stories */}
                {fundedCampaigns.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-3xl">🎉</span>
                            <h2 className="text-2xl font-black text-gray-800 italic">Recently Funded Success Stories</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {fundedCampaigns.map(campaign => (
                                <div
                                    key={campaign._id}
                                    onClick={() => setSelectedCampaign(campaign)}
                                    className="bg-white rounded-2xl p-5 border-2 border-green-100 shadow-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100 italic cursor-pointer transform hover:-translate-y-1"
                                >
                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                                        Goal Reached
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-1">{campaign.title}</h3>
                                    <p className="text-gray-500 text-xs mb-3 line-clamp-2">{campaign.story}</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-green-600 font-bold">₹{campaign.goalAmount?.toLocaleString()} Funded</span>
                                        <span className="text-gray-400">by {campaign.donors?.length || 0} supporters</span>
                                    </div>
                                    <div className="mt-3 text-[10px] text-indigo-600 font-bold text-right group-hover:underline cursor-pointer">Read Full Story →</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CSR Partner Section */}
                <div className="mt-12 bg-white rounded-2xl p-8 shadow-md border border-gray-100 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">🏢 CSR Partners & NGO Donors</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                        Are you a CSR company or an NGO looking to make an impact? Partner with us to sponsor deserving students
                        and receive transparent impact reports.
                    </p>
                    <div className="flex justify-center gap-6 flex-wrap">
                        <div className="bg-blue-50 border border-blue-200 px-6 py-4 rounded-xl text-center">
                            <p className="text-3xl font-black text-blue-600">{globalStats.totalActive}</p>
                            <p className="text-xs text-blue-600 font-semibold">Active Campaigns</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 px-6 py-4 rounded-xl text-center">
                            <p className="text-3xl font-black text-green-600">
                                ₹{globalStats.totalRaised.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600 font-semibold">Total Raised So Far</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 px-6 py-4 rounded-xl text-center">
                            <p className="text-3xl font-black text-purple-600">
                                {globalStats.totalDonors}
                            </p>
                            <p className="text-xs text-purple-600 font-semibold">Lifetime Donors</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donate Modal */}
            {donateModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Donate to Campaign</h3>
                            <button onClick={() => setDonateModal(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">Supporting: <strong>{donateModal.title}</strong></p>

                        <form onSubmit={handleDonate} className="space-y-3">
                            <input type="text" placeholder="Your Name" className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={donorForm.name} onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })} />
                            <input type="email" placeholder="Your Email" className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={donorForm.email} onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })} />
                            <input type="number" placeholder="Amount (₹)" className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" value={donorForm.amount} onChange={(e) => setDonorForm({ ...donorForm, amount: e.target.value })} required />
                            <textarea placeholder="Leave a message (optional)" className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" rows={2} value={donorForm.message} onChange={(e) => setDonorForm({ ...donorForm, message: e.target.value })} />
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input type="checkbox" checked={donorForm.isAnonymous} onChange={(e) => setDonorForm({ ...donorForm, isAnonymous: e.target.checked })} />
                                Donate anonymously
                            </label>
                            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 shadow-lg">
                                Confirm Donation
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Detail Modal */}
            {selectedCampaign && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedCampaign.status === 'Funded' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {selectedCampaign.status}
                                </span>
                                <h2 className="text-3xl font-black text-gray-900 mt-2">{selectedCampaign.title}</h2>
                                <p className="text-gray-500 font-bold">
                                    Beneficiary: {selectedCampaign.student?.name || 'Anonymous Student'}
                                </p>
                            </div>
                            <button onClick={() => setSelectedCampaign(null)} className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none">×</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-black text-indigo-600 uppercase mb-2">The Story</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedCampaign.story}</p>
                                </div>
                                {selectedCampaign.courseName && (
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Academic Info</p>
                                        <p className="text-sm font-bold text-gray-700">📚 {selectedCampaign.courseName}</p>
                                        <p className="text-xs text-gray-500">{selectedCampaign.instituteName}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-black text-green-600 uppercase mb-4">Funding Progress</h3>
                                <div className="bg-white border-2 border-gray-50 rounded-2xl p-6 shadow-sm">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <p className="text-3xl font-black text-gray-900">₹{selectedCampaign.raisedAmount?.toLocaleString()}</p>
                                        <p className="text-sm text-gray-400 font-bold">Goal: ₹{selectedCampaign.goalAmount?.toLocaleString()}</p>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                            style={{ width: `${progressPercent(selectedCampaign.raisedAmount, selectedCampaign.goalAmount)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-black uppercase text-gray-500">
                                        <span>{progressPercent(selectedCampaign.raisedAmount, selectedCampaign.goalAmount)}% Funded</span>
                                        <span>{selectedCampaign.donors?.length || 0} Supporters</span>
                                    </div>
                                    {selectedCampaign.status === 'Active' && (
                                        <button
                                            onClick={() => {
                                                setDonateModal(selectedCampaign);
                                                setSelectedCampaign(null);
                                            }}
                                            className="mt-6 w-full bg-green-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-green-700 transition-all active:scale-95"
                                        >
                                            🚀 Support This Student
                                        </button>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">Recent Supporters</h3>
                                    <div className="space-y-3">
                                        {selectedCampaign.donors?.slice(0, 5).map((donor, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                    {donor.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold text-gray-700">{donor.name}</p>
                                                    <p className="text-[10px] text-gray-400 italic">"{donor.message || 'Best wishes!'}"</p>
                                                </div>
                                                <p className="text-xs font-black text-gray-900">₹{donor.amount}</p>
                                            </div>
                                        ))}
                                        {(!selectedCampaign.donors || selectedCampaign.donors.length === 0) && (
                                            <p className="text-xs text-center text-gray-400 italic py-4">No donors yet. Be the first!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Crowdfunding;
