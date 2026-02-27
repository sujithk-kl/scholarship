import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import AIVerificationBadge from '../components/AIVerificationBadge';
import {
    BarChart3, Scale, Clock, TestTube, Landmark,
    Trash2, CheckCircle, XCircle, ArrowRight, ShieldCheck,
    AlertCircle, Megaphone, FileText, Send, Zap, ChevronRight, ArrowLeft,
    Search, Filter
} from 'lucide-react';

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
        name: '', description: '', amount: '', deadline: '', eligibility: '',
        incomeCap: '500000', minMarks: '50', eligibleCategories: [], tags: []
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
            alert('Application Approved successfully.');
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
        if (!window.confirm('Permenently remove this announcement?')) return;
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
                name: '', description: '', amount: '', deadline: '', eligibility: '',
                incomeCap: '500000', minMarks: '50', eligibleCategories: [], tags: []
            });
            fetchSchemes();
        } catch (error) {
            console.error(error);
            alert('Failed to create scheme');
        }
    };

    const handleDeleteScheme = async (id) => {
        if (!window.confirm('Permanently remove this scheme?')) return;
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
        const reply = prompt('Enter official reply/resolution message:');
        if (!reply) return;
        try {
            await api.put(`/admin/grievance/${id}/status`, { status: "Resolved", adminReply: reply });
            alert('Grievance Marked as Resolved');
            fetchGrievances();
        } catch (error) {
            console.error(error);
            alert('Failed to update status');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-blue-900">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="tracking-widest uppercase text-sm font-semibold text-slate-500">Initializing Enterprise Portal...</p>
        </div>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-[#F8FAFC] selection:bg-blue-600 selection:text-white pb-20">
            {/* Top Command Bar (Corporate Light) */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex flex-col xl:flex-row justify-between xl:items-center gap-6 shadow-sm mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight mb-0.5 text-blue-950">Administrative Control Center</h1>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Global System Authority</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={() => navigate('/admin/analytics')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm">
                        <BarChart3 size={14} className="text-blue-600" /> Analytics
                    </button>
                    <button onClick={() => navigate('/admin/grievances')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm">
                        <Scale size={14} className="text-rose-600" /> Helpdesk
                    </button>
                    <button onClick={() => navigate('/admin/expired-documents')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm">
                        <Clock size={14} className="text-amber-600" /> Expiry Tracker
                    </button>
                    <button onClick={() => navigate('/admin/simulator')} className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-700 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-sm">
                        <TestTube size={14} className="text-purple-600" /> Simulator
                    </button>
                    <button onClick={() => navigate('/admin/schemes')} className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shadow-md">
                        <Landmark size={14} /> Schemes
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Clean Corporate Tab Navigation */}
                <div className="flex flex-wrap gap-1 mb-8 bg-slate-200/50 p-1.5 rounded-xl border border-slate-200 w-fit mx-auto lg:mx-0">
                    {[
                        { id: 'applications', label: `Applications (${applications.length})` },
                    {id: 'announcements', label: 'Announcements' },
                    {id: 'schemes', label: 'Scholarships' },
                    {id: 'grievances', label: `Grievances (${grievances.filter(g => g.status === 'Open').length})` }
                    ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${activeTab === tab.id
                            ? 'bg-white text-blue-900 shadow-sm border border-slate-200'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200 border border-transparent'}`}
                        >
                    {tab.label}
                </button>
                    ))}
        </div>

                {/* --- APPLICATIONS TAB --- */ }
    {
        activeTab === 'applications' && (
            !selectedApp ? (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8 border-b border-slate-100 pb-6">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            <FileText size={24} className="text-blue-600" /> Application Registry
                        </h2>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {currentFilter !== 'All' && !['Approved', 'Rejected', 'Pending'].includes(currentFilter) && (
                                <div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Filter size={14} /> {currentFilter}
                                    <button onClick={() => setCurrentFilter('All')} className="hover:text-rose-600 ml-2"><XCircle size={16} /></button>
                                </div>
                            )}
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setCurrentFilter(f)}
                                        className={`px-4 py-2 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${currentFilter === f ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                                            >
                                {f}
                            </button>
                                        ))}
                        </div>
                    </div>
                </div>
                            
                            {
            filteredApps.length === 0 ? (
                <div className="py-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                        <Search size={32} className="text-slate-400" />
                    </div>
                    <p className="font-medium text-slate-500 text-lg">No {currentFilter.toLowerCase()} records match criteria.</p>
                </div>
            ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left bg-white">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">UID</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applicant Name</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Classification</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trust Score</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredApps.map(app => (
                            <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 font-mono text-sm text-slate-500">{app._id.substring(0, 8)}</td>
                                <td className="p-4 font-semibold text-slate-800">{app.student?.name}</td>
                                <td className="p-4 text-sm text-slate-600">{app.applicationType}</td>
                                <td className="p-4">
                                    <AIVerificationBadge score={app.aiVerificationScore} showLabel={false} />
                                </td>
                                <td className="p-4"><StatusBadge status={app.currentStatus} /></td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => fetchAppDetails(app._id)}
                                        className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-100 font-bold text-xs uppercase tracking-wide inline-flex items-center gap-1 transition-colors"
                                    >
                                        Inspect
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
        }
                        </div >
                    ) : (
    <div className="space-y-6 animate-fade-in-up">
        <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-blue-700 font-bold text-sm flex items-center gap-2 mb-2 transition-colors">
            <ArrowLeft size={16} /> Return to Registry
        </button>

        <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 mb-10 border-b border-slate-100 pb-8">
                <div>
                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-1.5"><AlertCircle size={14} /> Final Review Required</p>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-4">Dossier: {selectedApp.application.student?.name}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono bg-slate-100 px-3 py-1 rounded text-slate-600 text-sm border border-slate-200">UID: {selectedApp.application._id}</span>
                        <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-100 text-sm">{selectedApp.application.applicationType}</span>
                        <AIVerificationBadge score={selectedApp.application.aiVerificationScore} />
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleReject} className="bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 hover:border-rose-200 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 shadow-sm">
                        <XCircle size={16} /> Decline
                    </button>
                    <button onClick={handleApprove} className="bg-blue-900 hover:bg-blue-800 text-white border border-transparent px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest shadow-md transition-colors flex items-center gap-2">
                        Authorize <CheckCircle size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Current Workflow State</h3>
                    <div className="space-y-3">
                        <p className="text-lg font-medium text-slate-800 flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-sm text-slate-500 font-normal">Status:</span> {selectedApp.application.currentStatus}
                        </p>
                        <p className="text-lg font-medium text-slate-800 flex items-center justify-between pb-1">
                            <span className="text-sm text-slate-500 font-normal">Verification Stage:</span> {selectedApp.application.verificationStage}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Analysis Directives</h3>
                    <div className="text-sm text-slate-600 leading-relaxed">
                        Review applicant data thoroughly. Documents have been pre-verified by the verifier unit. Proceed with final financial authorization.
                    </div>
                </div>
            </div>
        </div>
    </div>
)
                )}

{/* --- ANNOUNCEMENTS TAB --- */ }
{
    activeTab === 'announcements' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Post Form (Left) */}
            <div className="xl:col-span-5 relative">
                <div className="sticky top-32 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4"><Megaphone size={20} className="text-blue-600" /> Broadcast Directive</h2>

                    <form onSubmit={handleCreateAnnouncement} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Headline</label>
                            <input
                                type="text"
                                className="w-full bg-white border border-slate-300 focus:border-blue-500 text-slate-800 px-4 py-3 rounded-lg outline-none font-medium transition-colors"
                                value={newAnnouncement.title}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Category</label>
                                <select
                                    className="w-full bg-white border border-slate-300 focus:border-blue-500 text-slate-800 px-4 py-3 rounded-lg outline-none transition-colors"
                                    value={newAnnouncement.type}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                                >
                                    <option value="Important">Important</option>
                                    <option value="New Scheme">New Scheme</option>
                                    <option value="Alert">Alert</option>
                                    <option value="System">System</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Datestamp</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Feb 28, 2026"
                                    className="w-full bg-white border border-slate-300 focus:border-blue-500 text-slate-800 px-4 py-3 rounded-lg outline-none transition-colors"
                                    value={newAnnouncement.date}
                                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Message Payload</label>
                            <textarea
                                className="w-full bg-white border border-slate-300 focus:border-blue-500 text-slate-800 px-4 py-3 rounded-lg outline-none h-28 resize-none transition-colors"
                                value={newAnnouncement.content}
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3.5 rounded-lg font-bold text-xs uppercase tracking-widest shadow-md transition-colors flex items-center justify-center gap-2">
                            Deploy Broadcast <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>

            {/* Announcements Feed (Right) */}
            <div className="xl:col-span-7 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
                {announcements.map(item => (
                                <div key={item._id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-6 group hover:border-slate-300 transition-colors shadow-sm">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${item.type === 'Alert' ? 'bg-rose-100 text-rose-700' : item.type === 'Important' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {item.type}
                                            </span>
                                            <span className="text-xs font-mono text-slate-500">{item.date}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight">{item.title}</h3>
                                        <p className="text-sm text-slate-600 leading-relaxed">{item.content}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteAnnouncement(item._id)}
                                        className="sm:opacity-0 group-hover:opacity-100 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 p-2.5 rounded-lg transition-colors shadow-sm"
                                        title="Revoke Broadcast"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
            {announcements.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="font-medium italic text-slate-500 text-lg">Communications matrix empty.</p>
                </div>
            )}
        </div>
                    </div >
                )
}

{/* --- SCHEMES TAB --- */ }
{
    activeTab === 'schemes' && (
        <div className="space-y-12 animate-fade-in-up">
            {/* Define Scheme (Form) */}
            <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-100 pb-5"><Landmark size={24} className="text-blue-600" /> Formulate Financial Instrument</h2>

                <form onSubmit={handleCreateScheme} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Instrument Designation</label>
                        <input type="text" className="w-full bg-slate-50 border border-slate-300 text-slate-800 p-3.5 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors text-lg font-semibold" value={newScheme.name} onChange={(e) => setNewScheme({ ...newScheme, name: e.target.value })} required />
                    </div>

                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Capital Allocation (₹)</label>
                        <input type="number" className="w-full bg-slate-50 border border-slate-300 text-slate-800 p-3.5 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors font-mono" value={newScheme.amount} onChange={(e) => setNewScheme({ ...newScheme, amount: e.target.value })} required />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Maturity / Deadline</label>
                        <input type="date" className="w-full bg-slate-50 border border-slate-300 text-slate-800 p-3.5 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors font-mono" value={newScheme.deadline} onChange={(e) => setNewScheme({ ...newScheme, deadline: e.target.value })} required />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Program Charter / Description</label>
                        <textarea className="w-full bg-slate-50 border border-slate-300 text-slate-800 p-3.5 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none h-24" value={newScheme.description} onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })} required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Eligibility Dictate (Text)</label>
                        <textarea className="w-full bg-slate-50 border border-slate-300 text-slate-800 p-3.5 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition-colors resize-none h-24" value={newScheme.eligibility} onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })} required />
                    </div>

                    <div className="md:col-span-2 border-t border-slate-200 pt-8 mt-2">
                        <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-widest mb-5 flex items-center gap-2"><TestTube size={16} className="text-blue-500" /> Algorithmic Matching Rules</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Maximum Income</label>
                                <input type="number" className="w-full bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors font-mono text-sm" value={newScheme.incomeCap} onChange={(e) => setNewScheme({ ...newScheme, incomeCap: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Min Academic Baseline (%)</label>
                                <input type="number" className="w-full bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors font-mono text-sm" value={newScheme.minMarks} onChange={(e) => setNewScheme({ ...newScheme, minMarks: e.target.value })} />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Legally Permitted Categories</label>
                                <div className="flex flex-wrap gap-2">
                                    {['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'].map(cat => (
                                        <button
                                            key={cat} type="button"
                                            onClick={() => {
                                                const current = newScheme.eligibleCategories;
                                                const updated = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
                                                setNewScheme({ ...newScheme, eligibleCategories: updated });
                                            }}
                                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors border ${newScheme.eligibleCategories.includes(cat) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}
                                                    >
                                    {cat}
                                </button>
                                                ))}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Heuristic Tags (Comma Separated)</label>
                            <input type="text" className="w-full bg-white border border-slate-300 text-slate-800 px-3 py-2 rounded-lg outline-none focus:border-blue-500 transition-colors text-sm" value={newScheme.tags.join(', ')} onChange={(e) => setNewScheme({ ...newScheme, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })} placeholder="e.g. STEM, Medical, Research" />
                        </div>
                    </div>
            </div>

            <button type="submit" className="md:col-span-2 bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-md transition-colors mt-4">
                Instantiate Scheme Object
            </button>
        </form>
                        </div >

        {/* Active Portfolio Grid */ }
        < div >
                            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">Active Market Portfolio</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {schemes.map(scheme => (
                                    <div key={scheme._id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded inline-flex items-center gap-1.5">
                                                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Fund Alloc:</span>
                                                    <span className="font-mono text-blue-700 font-bold text-sm">₹{scheme.amount}</span>
                                                </div>
                                                <button onClick={() => handleDeleteScheme(scheme._id)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded bg-white hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-800 mb-2 leading-snug">{scheme.name}</h4>
                                            <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">{scheme.description}</p>
                                        </div>
                                        <div>
                                            <div className="h-px w-full bg-slate-100 mb-4"></div>
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                                <span>Maturity Drop</span>
                                                <span className="text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">{new Date(scheme.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div >
                    </div >
                )
}

{/* --- GRIEVANCES TAB --- */ }
{
    activeTab === 'grievances' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Megaphone size={24} className="text-rose-600" /> Central Intercom & Disputes
            </h2>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left bg-white">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tick ID</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Originator</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Vector</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context / Body</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">State</th>
                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Resolve</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {grievances.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-slate-500 font-medium text-lg bg-slate-50">Intercom frequency clear.</td>
                            </tr>
                        ) : (
                            grievances.map(ticket => (
                                            <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 text-xs font-mono text-slate-500">{ticket._id.substring(0, 8)}</td>
                                                <td className="p-4">
                                                    <div className="font-semibold text-slate-800">{ticket.name}</div>
                                                    <div className="text-[10px] text-slate-500 tracking-wider bg-slate-100 px-2 py-0.5 rounded inline-block mt-1">{ticket.email}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded uppercase tracking-widest">{ticket.type}</span>
                                                </td>
                                                <td className="p-4 max-w-[300px]">
                                                    <div className="font-semibold text-sm text-slate-800 truncate">{ticket.subject}</div>
                                                    <div className="text-xs text-slate-500 truncate mt-1">{ticket.description}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded border ${ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ticket.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                                        {ticket.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    {ticket.status !== 'Resolved' ? (
                                                        <button onClick={() => handleResolveGrievance(ticket._id)} className="bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm inline-flex items-center gap-1">
                                                            Neutralize
                                                        </button>
                                                    ) : (
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 inline-flex items-center gap-1"><CheckCircle size={14}/> Sealed</span>
                                                    )}
                                                </td>
                                            </tr>
                    ))
                                    )}
                </tbody>
            </table>
        </div>
                    </div >
                )
}
            </main >

    <style dangerouslySetInnerHTML={{
        __html: `
                .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            `}} />
        </div>
    );
};

export default AdminDashboard;
