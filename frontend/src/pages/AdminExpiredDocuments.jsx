import React, { useState, useEffect } from 'react';
import api, { SERVER_BASE_URL } from '../services/api';
import { AlertTriangle, Clock, User, FileText, CheckCircle, Search, Calendar, ExternalLink, ShieldAlert, FileX } from 'lucide-react';

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
        <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 border-b border-slate-200 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shadow-sm">
                                <ShieldAlert size={20} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Validity Expiration Log
                            </h1>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Compliance & Re-verification Module</p>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search Subject or Doc Identifier..."
                            className="w-full md:w-80 pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-sm font-medium transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="tracking-widest uppercase text-xs font-bold text-slate-400">Querying Expiration Database...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200 shadow-sm flex flex-col items-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                            <CheckCircle className="text-emerald-500 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">System Optimal</h3>
                        <p className="text-sm font-medium text-slate-500">Zero validity infractions detected in the current cycle.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((item, index) => (
                            <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all group flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                
                                <div className="flex justify-between items-start mb-5">
                                    <div className={`px-2.5 py-1 rounded inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest border shadow-sm
                                        ${item.verificationStatus === 'Expired' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-50 text-slate-600 border-slate-200'}
                                    `}>
                                        {item.verificationStatus === 'Expired' && <AlertTriangle size={10} />}
                                        Status: {item.verificationStatus}
                                    </div>
                                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                        <FileX size={20} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-900 transition-colors">{item.documentType}</h3>
                                
                                <div className="flex items-center gap-2 text-orange-600 mb-6 bg-orange-50/50 p-2 rounded-lg border border-orange-100/50 w-fit">
                                    <Calendar size={14} />
                                    <span className="text-xs font-bold">Lapsed: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'System Default'}</span>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 flex-grow">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Subject Dossier</p>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs uppercase shadow-sm">
                                            {item.applicationId?.student?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="min-w-0 pr-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">{item.applicationId?.student?.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{item.applicationId?.student?.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-white p-2.5 rounded-lg border border-slate-200 font-medium">
                                        <Search size={12} className="text-blue-400 shrink-0" />
                                        <span className="truncate">Ref: {item.applicationId?._id}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-auto">
                                    <a
                                        href={`${SERVER_BASE_URL}${item.fileUrl}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-[0.3] flex items-center justify-center bg-white border border-slate-200 text-slate-600 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                                        title="Examine Document"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                    <button
                                        onClick={() => alert('Navigate to verification protocol for this subject')}
                                        className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 shadow-md transition-all active:scale-[0.98] border border-slate-800"
                                    >
                                        Enforce Protocol
                                    </button>
                                </div>
        </div>
    ))
}
                    </div >
                )}
            </div >

    <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.5s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default AdminExpiredDocs;
