import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Layout,
    Plus,
    Trash2,
    Calendar,
    IndianRupee,
    Users,
    Tag,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ArrowLeft,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminSchemes = () => {
    const navigate = useNavigate();
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [newScheme, setNewScheme] = useState({
        name: '',
        description: '',
        amount: '',
        deadline: '',
        eligibility: '',
        incomeCap: '500000',
        minMarks: '50',
        eligibleCategories: [],
        tags: []
    });

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSchemes();
    }, []);

    const fetchSchemes = async () => {
        try {
            const { data } = await api.get('/admin/schemes');
            setSchemes(data);
        } catch (error) {
            console.error("Failed to fetch schemes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/scheme', newScheme);
            alert('Scheme successfully deployed! 🚀');
            setNewScheme({
                name: '',
                description: '',
                amount: '',
                deadline: '',
                eligibility: '',
                incomeCap: '500000',
                minMarks: '50',
                eligibleCategories: [],
                tags: []
            });
            setShowForm(false);
            fetchSchemes();
        } catch (error) {
            alert('Failed to deploy scheme');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('This will permanently remove the scheme and prevent new applications. Continue?')) return;
        try {
            await api.delete(`/admin/scheme/${id}`);
            fetchSchemes();
        } catch (error) {
            alert('Deletion failed');
        }
    };

    const toggleCategory = (cat) => {
        const current = newScheme.eligibleCategories;
        const updated = current.includes(cat)
            ? current.filter(c => c !== cat)
            : [...current, cat];
        setNewScheme({ ...newScheme, eligibleCategories: updated });
    };

    const filteredSchemes = schemes.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div>
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-2 hover:translate-x-1 transition-transform"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                        <Layout className="w-10 h-10 text-indigo-600" />
                        Scheme Management
                    </h1>
                    <p className="text-gray-500 font-medium">Configure eligibility policies and deploy new scholarship programs</p>
                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Launch New Scheme
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Active Schemes</p>
                    <h2 className="text-3xl font-black text-indigo-900">{schemes.length}</h2>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Allocation</p>
                    <h2 className="text-3xl font-black text-green-600">₹{schemes.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}</h2>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Avg. Eligibility Score</p>
                    <h2 className="text-3xl font-black text-orange-500">88.4%</h2>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 min-h-[600px] overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30">
                    <h2 className="text-xl font-black text-gray-800">Deployed Programs</h2>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search schemes by name or keywords..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="font-bold">Retrieving schemes...</p>
                        </div>
                    ) : filteredSchemes.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                            <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-500">No matching schemes found</h3>
                            <button onClick={() => setShowForm(true)} className="mt-4 text-indigo-600 font-black hover:underline">Deploy your first scheme &rarr;</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {filteredSchemes.map(scheme => (
                                <div key={scheme._id} className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleDelete(scheme._id)}
                                            className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{scheme.name}</h3>
                                            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(scheme.deadline).toLocaleDateString()} Deadline</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
                                        {scheme.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 flex flex-col justify-center">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Grant Amount</p>
                                            <p className="text-xl font-black text-emerald-900">₹{scheme.amount?.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex flex-col justify-center">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">Income Cap</p>
                                            <p className="text-xl font-black text-indigo-900">₹{scheme.incomeCap?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {scheme.eligibleCategories.map(cat => (
                                            <span key={cat} className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full uppercase tracking-wider">{cat}</span>
                                        ))}
                                        {scheme.minMarks > 0 && (
                                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-wider">Min {scheme.minMarks}%</span>
                                        )}
                                        {scheme.tags.map(tag => (
                                            <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-500 text-[10px] font-black rounded-full uppercase tracking-wider border border-gray-100">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Scheme Creation Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col">
                        <div className="bg-indigo-600 p-8 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-3xl font-black italic">Deploy Scheme</h2>
                                <p className="text-indigo-200 font-bold text-sm">Configure AI-ready eligibility parameters</p>
                            </div>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"
                            >
                                <XCircle className="w-8 h-8" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-8 overflow-y-auto space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Basic Info */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Program Identity</label>
                                        <input
                                            type="text"
                                            placeholder="Official Scholarship Name"
                                            className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                                            value={newScheme.name}
                                            onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Funding Goal</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                placeholder="Benefit Amount per Student"
                                                className="w-full border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                                                value={newScheme.amount}
                                                onChange={(e) => setNewScheme({ ...newScheme, amount: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Application Deadline</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="date"
                                                className="w-full border-2 border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:border-indigo-500 font-bold transition-all"
                                                value={newScheme.deadline}
                                                onChange={(e) => setNewScheme({ ...newScheme, deadline: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="flex flex-col h-full">
                                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Program Abstract</label>
                                    <textarea
                                        placeholder="Briefly describe the purpose and impact of this scholarship..."
                                        className="flex-1 w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-medium transition-all min-h-[150px] resize-none"
                                        value={newScheme.description}
                                        onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Eligibility String */}
                                <div className="space-y-6">
                                    <label className="block text-xs font-black text-gray-400 uppercase mb-2 tracking-widest">Public Eligibility Rulebook</label>
                                    <textarea
                                        placeholder="List detailed rules as they should appear to students..."
                                        className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-indigo-500 font-medium transition-all min-h-[200px] resize-none"
                                        value={newScheme.eligibility}
                                        onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                {/* AI Selection Engine Config */}
                                <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50 space-y-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-indigo-600" />
                                        <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">AI Matching Parameters</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Income Cap (₹)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm"
                                                value={newScheme.incomeCap}
                                                onChange={(e) => setNewScheme({ ...newScheme, incomeCap: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Min Marks (%)</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white border border-indigo-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm"
                                                value={newScheme.minMarks}
                                                onChange={(e) => setNewScheme({ ...newScheme, minMarks: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-wider">Eligible Demographics</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'].map(cat => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`px-3 py-1 rounded-full text-[10px] font-black transition-all border-2 ${newScheme.eligibleCategories.includes(cat)
                                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100'
                                                            : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-200'
                                                        }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block tracking-wider">Policy Tags / Keywords</label>
                                        <div className="relative">
                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <input
                                                type="text"
                                                placeholder="Engineering, Girls Education, Research..."
                                                className="w-full bg-white border border-indigo-100 p-3 pl-10 rounded-xl outline-none focus:ring-2 focus:ring-indigo-400 font-bold text-sm"
                                                value={newScheme.tags.join(', ')}
                                                onChange={(e) => setNewScheme({ ...newScheme, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                                            />
                                        </div>
                                        <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase italic">Tags help the AI prioritize students with matching interests</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all text-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    Finalize & Deployed Scheme
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSchemes;
