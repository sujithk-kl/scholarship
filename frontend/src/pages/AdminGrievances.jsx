import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, CheckCircle, Clock, AlertCircle, Search, Filter, MessageCircle, Send, X } from 'lucide-react';

const AdminGrievances = () => {
    const [grievances, setGrievances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const [selectedGrievance, setSelectedGrievance] = useState(null);
    const [response, setResponse] = useState('');
    const [updatingStatus, setUpdatingStatus] = useState('');

    useEffect(() => {
        fetchGrievances();
    }, []);

    const fetchGrievances = async () => {
        try {
            const { data } = await api.get('/complaints/admin/list');
            setGrievances(data);
        } catch (error) {
            console.error("Failed to fetch grievances", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!updatingStatus) return;
        try {
            await api.put(`/complaints/admin/update/${selectedGrievance._id}`, {
                status: updatingStatus,
                adminResponse: response
            });
            alert('Grievance Updated!');
            setSelectedGrievance(null);
            fetchGrievances();
        } catch (error) {
            alert('Update failed');
        }
    };

    const filtered = grievances.filter(g => {
        const matchesSearch = g.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            g.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || g.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-800">Grievance Management</h1>
                    <p className="text-gray-500">Review and resolve student complaints</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by student or subject..."
                            className="pl-10 pr-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-red-500 w-72 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="border rounded-xl px-4 py-2 outline-none bg-white font-bold text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-bold">Loading Complaints...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold bg-white rounded-2xl border-2 border-dashed">No grievances found.</div>
                ) : (
                    filtered.map(g => (
                        <div key={g._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                            {g.category}
                                        </span>
                                        <span className="text-gray-400 text-xs">#{g._id.substring(g._id.length - 6)}</span>
                                    </div>
                                    <h3 className="text-xl font-extrabold text-gray-800">{g.subject}</h3>
                                    <p className="text-sm text-gray-500 font-medium">From: <span className="text-red-900">{g.studentId?.name || 'Unknown Student'}</span> ({g.studentId?.email})</p>
                                </div>
                                <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border
                                    ${g.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                                        g.status === 'Under Review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            g.status === 'Closed' ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-700 border-orange-200'}
                                `}>
                                    {g.status}
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                                "{g.description}"
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-xs text-gray-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Received on {new Date(g.createdAt).toLocaleString()}
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedGrievance(g);
                                        setResponse(g.adminResponse || '');
                                        setUpdatingStatus(g.status);
                                    }}
                                    className="bg-red-800 text-white px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-900 shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Take Action
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Action Modal */}
            {selectedGrievance && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-red-900 text-white p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-black">Resolve Grievance</h2>
                                <p className="text-red-200 text-xs">Action for #{selectedGrievance._id.substring(selectedGrievance._id.length - 6)}</p>
                            </div>
                            <button onClick={() => setSelectedGrievance(null)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Student Complaint</label>
                                <div className="bg-gray-50 p-4 rounded-2xl border italic text-gray-600 text-sm">
                                    "{selectedGrievance.description}"
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase mb-2">Update Status</label>
                                    <select
                                        className="w-full border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-red-500 font-bold"
                                        value={updatingStatus}
                                        onChange={(e) => setUpdatingStatus(e.target.value)}
                                    >
                                        <option value="Submitted">Submitted</option>
                                        <option value="Under Review">Under Review</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                                {selectedGrievance.attachment && (
                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase mb-2">Supporting Doc</label>
                                        <a
                                            href={`http://localhost:5000${selectedGrievance.attachment}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block w-full text-center p-3 border-2 border-blue-100 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100 transition-all"
                                        >
                                            View Attachment
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-2">Resolution Remarks</label>
                                <textarea
                                    className="w-full border-2 border-gray-100 p-4 rounded-2xl outline-none focus:border-red-500 h-32 bg-gray-50 font-medium"
                                    placeholder="Explain the resolution or steps taken..."
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                ></textarea>
                            </div>

                            <button
                                onClick={handleUpdate}
                                className="w-full bg-red-800 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:bg-red-900 flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Send className="w-5 h-5" />
                                Commit Resolution
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGrievances;
