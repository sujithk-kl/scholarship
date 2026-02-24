import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import AIVerificationBadge from '../components/AIVerificationBadge';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('applications');
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('All');

    const [announcements, setAnnouncements] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [grievances, setGrievances] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'Important', date: '' });
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

    useEffect(() => {
        if (location.state?.filter) {
            setCurrentFilter(location.state.filter);
            setActiveTab('applications');
        }
    }, [location.state]);

    useEffect(() => {
        if (currentFilter === 'All') {
            setFilteredApps(applications);
        } else if (currentFilter.startsWith('District: ')) {
            const district = currentFilter.replace('District: ', '');
            setFilteredApps(applications.filter(app => app.district === district));
        } else if (currentFilter.startsWith('Month: ')) {
            const month = currentFilter.replace('Month: ', '');
            setFilteredApps(applications.filter(app => {
                const appMonth = new Date(app.createdAt).toLocaleString('default', { month: 'short' });
                return appMonth === month;
            }));
        } else {
            setFilteredApps(applications.filter(app => {
                if (currentFilter === 'Pending') return ['Submitted', 'Under Verification', 'Query Raised', 'Resubmitted'].includes(app.currentStatus);
                return app.currentStatus === currentFilter;
            }));
        }
    }, [currentFilter, applications]);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/admin/all-applications');
            setApplications(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchAnnouncements = async () => {
        try {
            const { data } = await api.get('/admin/announcements');
            setAnnouncements(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchSchemes = async () => {
        try {
            const { data } = await api.get('/admin/schemes');
            setSchemes(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchGrievances = async () => {
        try {
            const { data } = await api.get('/admin/grievances');
            setGrievances(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            await Promise.all([fetchApplications(), fetchAnnouncements(), fetchSchemes(), fetchGrievances()]);
            setLoading(false);
        };
        loadInitialData();
    }, []);

    // Application Handlers
    const fetchAppDetails = async (id) => {
        try {
            const { data } = await api.get(`/admin/application/${id}`);
            setSelectedApp(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleApprove = async () => {
        const amount = prompt('Enter Scholarship Amount (e.g., 50000):');
        if (!amount) return;
        try {
            await api.put(`/admin/application/${selectedApp.application._id}/approve`, { amount: Number(amount) });
            alert('Application Approved');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error(error);
            alert('Action Failed');
        }
    };

    const handleReject = async () => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;
        try {
            await api.put(`/admin/application/${selectedApp.application._id}/reject`, { reason });
            alert('Application Rejected');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error(error);
            alert('Action Failed');
        }
    };

    // Announcement Handlers
    const handleCreateAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/announcement', newAnnouncement);
            alert('Announcement Created');
            setNewAnnouncement({ title: '', content: '', type: 'Important', date: '' });
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            alert('Failed to create announcement');
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/announcement/${id}`);
            fetchAnnouncements();
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    // Scheme Handlers
    const handleCreateScheme = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/scheme', newScheme);
            alert('Scheme Created');
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
            fetchSchemes();
        } catch (error) {
            console.error(error);
            alert('Failed to create scheme');
        }
    };

    const handleDeleteScheme = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/admin/scheme/${id}`);
            fetchSchemes();
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    // Grievance Handlers
    const handleResolveGrievance = async (id) => {
        const reply = prompt('Enter reply/resolution message:');
        if (!reply) return;
        try {
            await api.put(`/admin/grievance/${id}/status`, { status: "Resolved", adminReply: reply });
            alert('Grievance Resolved');
            fetchGrievances();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-600">Loading Dashboard...</div>;

    return (
        <div className="bg-scholarship container mx-auto p-4 md:p-8 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/admin/analytics')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 font-bold flex items-center gap-2"
                    >
                        📊 Analytics
                    </button>
                    <button
                        onClick={() => navigate('/admin/grievances')}
                        className="bg-red-800 text-white px-4 py-2 rounded shadow hover:bg-red-900 font-bold flex items-center gap-2"
                    >
                        ⚖️ Grievance Portal
                    </button>
                    <button
                        onClick={() => navigate('/admin/expired-documents')}
                        className="bg-orange-600 text-white px-4 py-2 rounded shadow hover:bg-orange-700 font-bold flex items-center gap-2"
                    >
                        🕒 Expiry Tracker
                    </button>
                    <button
                        onClick={() => navigate('/admin/simulator')}
                        className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 font-bold flex items-center gap-2"
                    >
                        🧪 Policy Simulator
                    </button>
                    <button
                        onClick={() => navigate('/admin/schemes')}
                        className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 font-bold flex items-center gap-2"
                    >
                        📜 Manage Schemes
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-300 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('applications')}
                    className={`pb-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'applications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Applications ({applications.length})
                </button>
                <button
                    onClick={() => setActiveTab('announcements')}
                    className={`pb-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'announcements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Announcements
                </button>
                <button
                    onClick={() => setActiveTab('schemes')}
                    className={`pb-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'schemes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Scholarship Schemes
                </button>
                <button
                    onClick={() => setActiveTab('grievances')}
                    className={`pb-2 px-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'grievances' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Grievances ({grievances.filter(g => g.status === 'Open').length})
                </button>
            </div>

            {/* Applications Tab */}
            {activeTab === 'applications' && (
                !selectedApp ? (
                    <div className="bg-white p-6 rounded shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-700">Application Management</h2>
                            <div className="flex items-center gap-4">
                                {currentFilter !== 'All' && !['Approved', 'Rejected', 'Pending'].includes(currentFilter) && (
                                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                        Filter: {currentFilter}
                                        <button onClick={() => setCurrentFilter('All')} className="hover:text-red-500">×</button>
                                    </div>
                                )}
                                <div className="flex gap-2 bg-gray-100 p-1 rounded">
                                    {['All', 'Approved', 'Rejected', 'Pending'].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => setCurrentFilter(f)}
                                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${currentFilter === f ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {filteredApps.length === 0 ? <p className="text-gray-500">No {currentFilter.toLowerCase()} applications found.</p> : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="p-3 font-semibold text-gray-600">App ID</th>
                                            <th className="p-3 font-semibold text-gray-600">Student</th>
                                            <th className="p-3 font-semibold text-gray-600">Type</th>
                                            <th className="p-3 font-semibold text-gray-600">AI Trust</th>
                                            <th className="p-3 font-semibold text-gray-600">Status</th>
                                            <th className="p-3 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApps.map(app => (
                                            <tr key={app._id} className="border-b hover:bg-blue-50 transition-colors">
                                                <td className="p-3 font-mono text-sm">{app._id.substring(0, 8)}...</td>
                                                <td className="p-3">{app.student?.name}</td>
                                                <td className="p-3">{app.applicationType}</td>
                                                <td className="p-3">
                                                    <AIVerificationBadge score={app.aiVerificationScore} showLabel={false} />
                                                </td>
                                                <td className="p-3"><StatusBadge status={app.currentStatus} /></td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={() => fetchAppDetails(app._id)}
                                                        className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 shadow-sm"
                                                    >
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white p-6 rounded shadow-md border border-gray-200">
                        <button onClick={() => setSelectedApp(null)} className="mb-4 text-blue-600 hover:underline flex items-center gap-1">
                            &larr; Back to List
                        </button>

                        <div className="flex justify-between items-start mb-6 border-b pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Final Review</h2>
                                <p className="text-gray-600 mt-1">Student: <span className="font-semibold text-gray-800">{selectedApp.application.student?.name}</span></p>
                                <p className="text-gray-600 mb-2">Type: <span className="font-semibold text-blue-600">{selectedApp.application.applicationType}</span></p>
                                <AIVerificationBadge score={selectedApp.application.aiVerificationScore} />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={handleApprove} className="bg-green-600 text-white px-5 py-2 rounded shadow hover:bg-green-700 font-semibold">
                                    Final Approve
                                </button>
                                <button onClick={handleReject} className="bg-red-600 text-white px-5 py-2 rounded shadow hover:bg-red-700 font-semibold">
                                    Reject
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded border">
                            <h3 className="font-bold mb-3 text-gray-700">Application Details</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <p><span className="font-semibold">Status:</span> {selectedApp.application.currentStatus}</p>
                                <p><span className="font-semibold">Verification Stage:</span> {selectedApp.application.verificationStage}</p>
                            </div>
                        </div>
                    </div>
                )
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
                <div className="space-y-8">
                    {/* Create Announcement Form */}
                    <div className="bg-white p-6 rounded shadow-md border border-blue-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Post New Announcement</h2>
                        <form onSubmit={handleCreateAnnouncement} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Announcement Title"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                required
                            />
                            <select
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newAnnouncement.type}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                            >
                                <option value="Important">Important</option>
                                <option value="New Scheme">New Scheme</option>
                                <option value="Alert">Alert</option>
                                <option value="System">System</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Date (e.g., Feb 12, 2026)"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newAnnouncement.date}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Content / Description"
                                className="border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none md:col-span-2"
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 font-bold md:col-start-2 justify-self-end">
                                Post Announcement
                            </button>
                        </form>
                    </div>

                    {/* Announcements List */}
                    <div className="bg-white p-6 rounded shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Existing Announcements</h2>
                        <div className="space-y-4">
                            {announcements.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-4 border rounded hover:bg-gray-50">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${item.type === 'Alert' ? 'bg-red-500' : item.type === 'Important' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs text-gray-500">{item.date}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-600">{item.content}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(item._id)}
                                        className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Schemes Tab */}
            {activeTab === 'schemes' && (
                <div className="space-y-8">
                    {/* Create Scheme Form */}
                    <div className="bg-white p-6 rounded shadow-md border border-green-100">
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Add New Scholarship Scheme</h2>
                        <form onSubmit={handleCreateScheme} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Scheme Name"
                                className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none md:col-span-2"
                                value={newScheme.name}
                                onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                                value={newScheme.amount}
                                onChange={(e) => setNewScheme({ ...newScheme, amount: e.target.value })}
                                required
                            />
                            <input
                                type="date"
                                className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
                                value={newScheme.deadline}
                                onChange={(e) => setNewScheme({ ...newScheme, deadline: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Description"
                                className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none md:col-span-2"
                                value={newScheme.description}
                                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                                required
                            />
                            <textarea
                                placeholder="Eligibility Criteria (Text Description)"
                                className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none md:col-span-2"
                                value={newScheme.eligibility}
                                onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })}
                                required
                            />

                            {/* Structured Eligibility Header */}
                            <div className="md:col-span-2 mt-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                                <span className="text-sm font-black text-gray-400 uppercase tracking-widest">AI Matching Parameters</span>
                                <div className="h-px flex-1 bg-gray-100"></div>
                            </div>

                            <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1">Income Cap (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Max Annual Income"
                                        className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                        value={newScheme.incomeCap}
                                        onChange={(e) => setNewScheme({ ...newScheme, incomeCap: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1">Min Marks (%)</label>
                                    <input
                                        type="number"
                                        placeholder="Min Marks Required"
                                        className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                        value={newScheme.minMarks}
                                        onChange={(e) => setNewScheme({ ...newScheme, minMarks: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2 flex flex-col">
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-2">Eligible Categories</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'].map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    const current = newScheme.eligibleCategories;
                                                    const updated = current.includes(cat)
                                                        ? current.filter(c => c !== cat)
                                                        : [...current, cat];
                                                    setNewScheme({ ...newScheme, eligibleCategories: updated });
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-2 ${newScheme.eligibleCategories.includes(cat)
                                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                                    : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-200'
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-2 flex flex-col">
                                    <label className="text-[10px] font-black text-gray-500 uppercase mb-1">Tags / Interests (Comma Separated)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Engineering, Medical, Research"
                                        className="border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none text-sm"
                                        value={newScheme.tags.join(', ')}
                                        onChange={(e) => setNewScheme({ ...newScheme, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-green-700 font-black md:col-start-2 justify-self-end mt-4 active:scale-95 transition-all">
                                🚀 Deploy New Scheme
                            </button>
                        </form>
                    </div>

                    {/* Schemes List */}
                    <div className="bg-white p-6 rounded shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold mb-4 text-gray-700">Active Schemes</h2>
                        <div className="grid gap-6">
                            {schemes.map(scheme => (
                                <div key={scheme._id} className="p-4 border rounded hover:shadow-md transition-shadow bg-gray-50 relative">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-blue-900">{scheme.name}</h3>
                                            <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
                                            <div className="flex flex-wrap gap-4 text-sm mt-3">
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">₹{scheme.amount}</span>
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                <strong>Eligibility:</strong> {scheme.eligibility}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteScheme(scheme._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-semibold px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Grievances Tab */}
            {activeTab === 'grievances' && (
                <div className="bg-white p-6 rounded shadow-md border border-gray-200">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Student Grievances & Helpdesk</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 font-semibold text-gray-600">ID</th>
                                    <th className="p-3 font-semibold text-gray-600">Student (Email)</th>
                                    <th className="p-3 font-semibold text-gray-600">Type</th>
                                    <th className="p-3 font-semibold text-gray-600">Subject</th>
                                    <th className="p-3 font-semibold text-gray-600">Status</th>
                                    <th className="p-3 font-semibold text-gray-600">Date</th>
                                    <th className="p-3 font-semibold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {grievances.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="p-4 text-center text-gray-500">No grievances found.</td>
                                    </tr>
                                ) : (
                                    grievances.map(ticket => (
                                        <tr key={ticket._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 text-xs font-mono">{ticket._id.substring(0, 8)}...</td>
                                            <td className="p-3">
                                                <div className="font-semibold">{ticket.name}</div>
                                                <div className="text-xs text-gray-500">{ticket.email}</div>
                                            </td>
                                            <td className="p-3"><span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-700">{ticket.type}</span></td>
                                            <td className="p-3">
                                                <div className="font-semibold text-sm">{ticket.subject}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">{ticket.description}</div>
                                            </td>
                                            <td className="p-3">
                                                <span className={`text-xs px-2 py-1 rounded font-bold ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                {ticket.status !== 'Resolved' && (
                                                    <button
                                                        onClick={() => handleResolveGrievance(ticket._id)}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                                                    >
                                                        Resolve
                                                    </button>
                                                )}
                                                {ticket.status === 'Resolved' && (
                                                    <span className="text-green-600 text-xs font-bold">Closed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
