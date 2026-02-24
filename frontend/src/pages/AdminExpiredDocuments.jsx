import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { AlertTriangle, Clock, User, FileText, CheckCircle, Search, Calendar, ExternalLink } from 'lucide-react';

const AdminExpiredDocs = () => {
    const [expiredData, setExpiredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchExpired();
    }, []);

    const fetchExpired = async () => {
        try {
            const { data } = await api.get('/admin/expired-documents');
            setExpiredData(data);
        } catch (error) {
            console.error("Failed to fetch expired docs", error);
        } finally {
            setLoading(false);
        }
    };

    const filtered = expiredData.filter(d =>
        d.applicationId?.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
                        <AlertTriangle className="text-red-600 w-10 h-10" />
                        Expired Document Tracker
                    </h1>
                    <p className="text-gray-500">Monitoring validity and re-verification requests</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search student or doc type..."
                        className="pl-10 pr-4 py-3 border rounded-2xl outline-none focus:ring-2 focus:ring-red-500 w-80 bg-white shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 font-bold text-gray-400">Loading Tracker Data...</div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed text-gray-400 font-bold">
                    No expired documents detected. All good!
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(item => (
                        <div key={item._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter
                                    ${item.verificationStatus === 'Expired' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}
                                `}>
                                    {item.verificationStatus}
                                </div>
                                <div className="text-gray-300">
                                    <FileText size={40} />
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-gray-800 mb-1">{item.documentType}</h3>
                            <div className="flex items-center gap-2 text-red-600 mb-4">
                                <Calendar size={14} />
                                <span className="text-xs font-bold">Expired: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'System Default'}</span>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xs uppercase">
                                        {item.applicationId?.student?.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-gray-800">{item.applicationId?.student?.name}</p>
                                        <p className="text-[10px] text-gray-400">{item.applicationId?.student?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-white p-2 rounded-lg border border-gray-100">
                                    <AlertTriangle size={12} className="text-orange-400" />
                                    <span>App ID: {item.applicationId?._id}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <a
                                    href={`http://localhost:5000${item.fileUrl}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-xs hover:bg-gray-200 transition-all"
                                >
                                    <ExternalLink size={14} /> View Doc
                                </a>
                                <button
                                    onClick={() => alert('Navigate to verification page for this app')}
                                    className="flex-1 bg-red-800 text-white py-3 rounded-xl font-bold text-xs hover:bg-red-900 shadow-lg shadow-red-100 transition-all active:scale-95"
                                >
                                    Verify Re-upload
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminExpiredDocs;
