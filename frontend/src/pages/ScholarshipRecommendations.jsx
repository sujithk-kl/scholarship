import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ScholarshipRecommendations = () => {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [topMatch, setTopMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedScheme, setSelectedScheme] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await api.get('/student/recommendations');
                setRecommendations(data.recommendations || []);
                setTopMatch(data.topMatch);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load recommendations');
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-blue-500';
        if (score >= 40) return 'bg-yellow-500';
        return 'bg-red-400';
    };

    const getScoreBg = (score) => {
        if (score >= 80) return 'border-green-200 bg-green-50';
        if (score >= 60) return 'border-blue-200 bg-blue-50';
        if (score >= 40) return 'border-yellow-200 bg-yellow-50';
        return 'border-red-200 bg-red-50';
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-semibold">AI is analyzing your profile...</p>
                <p className="text-gray-400 text-sm mt-1">Matching scholarships to your eligibility</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="container mx-auto p-8">
            <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
                <p className="text-red-600 font-bold text-lg">{error}</p>
                <button onClick={() => navigate('/student/dashboard')} className="mt-4 text-blue-600 hover:underline">
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <button onClick={() => navigate('/student/dashboard')} className="text-blue-600 hover:underline text-sm mb-2 block">
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-black text-gray-900">🤖 AI Scholarship Recommendations</h1>
                        <p className="text-gray-500 mt-1">Personalized matches based on your income, marks, category, location & interests</p>
                    </div>
                    <div className="mt-4 md:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                        {recommendations.length} Schemes Analyzed
                    </div>
                </div>

                {/* Top Match Highlight */}
                {topMatch && topMatch.matchScore > 50 && (
                    <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase">⭐ Best Match</span>
                            <span className="text-white/80 text-sm">{topMatch.matchScore}% compatibility</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{topMatch.name}</h2>
                        <p className="text-white/90 mb-3">{topMatch.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-lg">💰 ₹{topMatch.amount?.toLocaleString()}</span>
                            {topMatch.deadline && (
                                <span className="bg-white/20 px-3 py-1 rounded-lg">📅 Deadline: {new Date(topMatch.deadline).toLocaleDateString()}</span>
                            )}
                            {topMatch.tags?.map((tag, i) => (
                                <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">{tag}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Score Breakdown Legend */}
                <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">How We Calculate Match Score</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Income (30%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Marks (25%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded-full"></span> Category (25%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded-full"></span> Location (10%)</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 bg-pink-500 rounded-full"></span> Interest (10%)</div>
                    </div>
                </div>

                {/* Recommendations Grid */}
                <div className="space-y-4">
                    {recommendations.map((scheme, index) => (
                        <div
                            key={scheme._id}
                            onClick={() => setSelectedScheme(scheme)}
                            className={`bg-white rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1 group ${getScoreBg(scheme.matchScore)}`}
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-gray-200 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                            #{index + 1}
                                        </span>
                                        <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3 ml-11">{scheme.description}</p>
                                    <div className="flex flex-wrap gap-2 ml-11">
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                            💰 ₹{scheme.amount?.toLocaleString()}
                                        </span>
                                        {scheme.deadline && (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
                                                📅 {new Date(scheme.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                        {scheme.tags?.map((tag, i) => (
                                            <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Match Score */}
                                <div className="text-center min-w-[120px]">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                            <circle cx="18" cy="18" r="15.91" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                                            <circle cx="18" cy="18" r="15.91" fill="none" stroke={scheme.matchScore >= 80 ? '#22c55e' : scheme.matchScore >= 60 ? '#3b82f6' : scheme.matchScore >= 40 ? '#eab308' : '#ef4444'} strokeWidth="3" strokeDasharray={`${scheme.matchScore} ${100 - scheme.matchScore}`} strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center text-lg font-black">{scheme.matchScore}%</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 font-semibold">Match Score</p>
                                </div>
                            </div>

                            {/* Breakdown Bar */}
                            <div className="mt-4 ml-11">
                                <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
                                    <div className="bg-blue-500" style={{ width: `${(scheme.breakdown?.income || 0)}%` }} title={`Income: ${scheme.breakdown?.income || 0}`}></div>
                                    <div className="bg-green-500" style={{ width: `${(scheme.breakdown?.marks || 0)}%` }} title={`Marks: ${scheme.breakdown?.marks || 0}`}></div>
                                    <div className="bg-purple-500" style={{ width: `${(scheme.breakdown?.category || 0)}%` }} title={`Category: ${scheme.breakdown?.category || 0}`}></div>
                                    <div className="bg-orange-500" style={{ width: `${(scheme.breakdown?.location || 0)}%` }} title={`Location: ${scheme.breakdown?.location || 0}`}></div>
                                    <div className="bg-pink-500" style={{ width: `${(scheme.breakdown?.tags || 0)}%` }} title={`Tags: ${scheme.breakdown?.tags || 0}`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Eligible CTA */}
                {recommendations.every(r => r.matchScore < 40) && (
                    <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
                        <h3 className="text-2xl font-bold text-amber-800 mb-3">Not eligible for government schemes?</h3>
                        <p className="text-amber-700 mb-6 max-w-lg mx-auto">
                            Don't worry! NGO donors and CSR companies can sponsor your education through our Crowdfunding platform.
                        </p>
                        <button
                            onClick={() => navigate('/crowdfunding')}
                            className="bg-amber-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200"
                        >
                            🤝 Start a Crowdfund Campaign
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedScheme && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${selectedScheme.matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                        {selectedScheme.matchScore}% Match
                                    </span>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900">{selectedScheme.name}</h2>
                            </div>
                            <button onClick={() => setSelectedScheme(null)} className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none">×</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-black text-indigo-600 uppercase mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">{selectedScheme.description}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-black text-indigo-600 uppercase mb-2">Eligibility Criteria</h3>
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700 space-y-2">
                                        <p className="whitespace-pre-wrap">{selectedScheme.eligibility}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                    <h3 className="text-sm font-black text-indigo-800 uppercase mb-4">Quick Details</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-xs font-bold uppercase">Scholarship Amount</span>
                                            <span className="text-xl font-black text-indigo-900">₹{selectedScheme.amount?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-bold uppercase text-[10px]">Deadline</span>
                                            <span className="font-bold text-red-600">{new Date(selectedScheme.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border-2 border-gray-50 shadow-sm">
                                    <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-widest text-center">Eligibility Breakdown</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500 font-bold">Income Cap</span>
                                            <span className="text-indigo-600 font-black">₹{selectedScheme.incomeCap?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-500 font-bold">Min Marks Required</span>
                                            <span className="text-indigo-600 font-black">{selectedScheme.minMarks}%</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {selectedScheme.eligibleCategories?.map((cat, i) => (
                                                <span key={i} className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-black">{cat}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/student/apply')}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Proceed to Apply 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScholarshipRecommendations;
