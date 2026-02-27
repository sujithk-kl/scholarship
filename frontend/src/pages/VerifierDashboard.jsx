import { useEffect, useState } from 'react';
import api, { SERVER_BASE_URL } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import AIVerificationBadge from '../components/AIVerificationBadge';
import { Cpu, RotateCw, FileText, CheckCircle, XCircle, Search, AlertCircle, Send, ArrowLeft, Download, ShieldCheck, ArrowRight } from 'lucide-react';

const VerifierDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(true);

    // Query State
    const [queryData, setQueryData] = useState({ fieldName: '', queryMessage: '' });
    const [isVerifying, setIsVerifying] = useState(false);

    const fetchApplications = async () => {
        try {
            const { data } = await api.get('/verifier/applications');
            setApplications(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAppDetails = async (id) => {
        try {
            const { data } = await api.get(`/verifier/application/${id}`);
            setSelectedApp(data); // data includes { application, documents, queries }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleVerifyDoc = async (docId, status) => {
        try {
            await api.put(`/verifier/document/${docId}/verify`, { status });
            // Refresh details
            fetchAppDetails(selectedApp.application._id);
        } catch (error) {
            console.error(error);
            alert('Action Failed');
        }
    };

    const handleRaiseQuery = async () => {
        try {
            await api.post('/verifier/query', {
                applicationId: selectedApp.application._id,
                fieldName: queryData.fieldName,
                queryMessage: queryData.queryMessage
            });
            alert('Query Raised successfully.');
            setQueryData({ fieldName: '', queryMessage: '' });
            fetchAppDetails(selectedApp.application._id);
        } catch (error) {
            console.error(error);
            alert('Failed to raise query');
        }
    };

    const handleForward = async () => {
        try {
            await api.put(`/verifier/application/${selectedApp.application._id}/forward`);
            alert('Application Forwarded to Admin');
            setSelectedApp(null);
            fetchApplications();
        } catch (error) {
            console.error(error);
            alert('Failed to forward');
        }
    };

    const handleAICheck = async () => {
        setIsVerifying(true);
        try {
            await api.post(`/verifier/application/${selectedApp.application._id}/ai-verify`);
            alert('AI Document Verification Completed');
            fetchAppDetails(selectedApp.application._id);
        } catch (error) {
            console.error(error);
            alert('AI Verification Failed');
        } finally {
            setIsVerifying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-blue-900">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="tracking-widest uppercase text-sm font-semibold text-slate-500">Initializing Verifier Environment...</p>
        </div>
    );

    return (
        <div className="min-h-screen font-sans text-slate-800 bg-[#F8FAFC] selection:bg-blue-600 selection:text-white pb-20">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-md">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight mb-0.5 text-blue-950">Verifier Node</h1>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Document Audit & Clearance</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {!selectedApp ? (
                    <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                        <h2 className="font-bold text-2xl tracking-tight mb-8 text-slate-800 border-b border-slate-100 pb-4">
                            Incoming Audit Queue
                        </h2>

                        {applications.length === 0 ? (
                            <div className="py-16 text-center">
                                <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                                    <ShieldCheck size={32} className="text-slate-400" />
                                </div>
                                <p className="font-medium text-slate-500 text-lg">No pending applications. Queue is clear.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                                <table className="min-w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applicant Subject</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Audit</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                            <th className="p-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {applications.map(app => (
                                            <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-4 font-mono text-sm text-slate-500">{app._id.slice(-8)}</td>
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
                                                        Review Task <ArrowRight size={14} />
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
                    <div className="space-y-6 animate-fade-in-up">
                        <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-blue-700 font-bold text-sm flex items-center gap-2 mb-2 transition-colors">
                            <ArrowLeft size={16} /> Back to Audit Queue
                        </button>

                        <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10 border-b border-slate-100 pb-8">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-800 mb-2">Dossier: {selectedApp.application.student?.name}</h2>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <span className="font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-600">ID: {selectedApp.application._id.slice(-8)}</span>
                                        • <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">{selectedApp.application.applicationType}</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3 items-center">
                                    <button
                                        onClick={handleAICheck}
                                        disabled={isVerifying}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-sm border ${isVerifying ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'}`}
                                    >
                                    {isVerifying ? <RotateCw className="animate-spin text-blue-500" size={16} /> : <Cpu size={16} className="text-blue-600" />}
                                    {isVerifying ? 'Analyzing...' : 'Execute AI Audit'}
                                </button>
                                <div className="bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm"><AIVerificationBadge score={selectedApp.application.aiVerificationScore} /></div>
                                <button onClick={handleForward} className="bg-blue-900 text-white px-5 py-2.5 rounded-lg text-xs uppercase tracking-widest shadow-md hover:bg-blue-800 font-bold flex items-center gap-2 transition-colors">
                                    Clear & Forward <Send size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Details Card */}
                            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <FileText size={16} className="text-blue-600" /> Subject Profile Data
                                </h3>
                                <div className="space-y-4">
                                    {Object.entries(selectedApp.application.profile?.personalDetails || {}).map(([k, v]) => (
                                        <div key={k} className="flex justify-between border-b border-slate-200 pb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            <span className="text-sm font-medium text-slate-800">{typeof v === 'object' ? JSON.stringify(v) : v?.toString() || '-'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Documents Panel */}
                            <div>
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-2 flex items-center gap-2">
                                    <ShieldCheck size={16} className="text-blue-600" /> Verification Evidences
                                </h3>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedApp.documents && selectedApp.documents.length > 0 ? (
                                        selectedApp.documents.map(doc => {
                                            const getDocIcon = (type) => {
                                                const icons = { 'Aadhar Card': '🆔', 'Income Certificate': '💰', 'Caste Certificate': '📋', 'Bank Passbook': '🏦', 'Academic Marksheet': '📚' };
                                                return icons[type] || '📄';
                                            };
                                            const documentUrl = `${SERVER_BASE_URL}${doc.fileUrl}`;

                                    return (
                                    <div key={doc._id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col xl:flex-row justify-between xl:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl w-12 h-12 bg-slate-50 rounded border border-slate-200 flex items-center justify-center">{getDocIcon(doc.documentType)}</div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{doc.documentType}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                    {doc.createdAt && `Uploaded: ${new Date(doc.createdAt).toLocaleDateString()}`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start xl:items-end gap-2">
                                            <div className="flex gap-2">
                                                <a href={documentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors flex items-center gap-1 border border-blue-200"><Search size={12} /> Inspect</a>
                                                <a href={documentUrl} download className="text-[10px] font-bold uppercase tracking-widest text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded transition-colors flex items-center gap-1 border border-slate-200"><Download size={12} /> File</a>
                                            </div>

                                            <div className="mt-1">
                                                {doc.verificationStatus === 'Pending' ? (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleVerifyDoc(doc._id, 'Approved')} className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded shadow-sm flex items-center gap-1 transition-colors"><CheckCircle size={12} /> Approve</button>
                                                        <button onClick={() => handleVerifyDoc(doc._id, 'Rejected')} className="text-[10px] font-bold uppercase tracking-widest text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded shadow-sm flex items-center gap-1 transition-colors"><XCircle size={12} /> Reject</button>
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest border ${doc.verificationStatus === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                                {doc.verificationStatus === 'Approved' ? <CheckCircle size={12} /> : <XCircle size={12} />} {doc.verificationStatus}
                                            </span>
                                                                )}
                                        </div>
                                    </div>
                                </div>
                                );
                                            })
                                ) : (
                                <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <AlertCircle size={32} className="text-slate-400 mx-auto mb-2" />
                                    <p className="font-medium text-slate-500 text-sm">No evidentiary documents provided.</p>
                                </div>
                                        )}
                            </div>
                        </div>
                    </div>

                            {/* Query System */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-600" /> Issue Flag / Query Generation
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <input
                            placeholder="Target (e.g. Income Cert)"
                            className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm focus:border-blue-500 outline-none text-sm w-full sm:w-1/3 font-medium text-slate-800 transition-all"
                            value={queryData.fieldName}
                            onChange={(e) => setQueryData({ ...queryData, fieldName: e.target.value })}
                        />
                        <input
                            placeholder="Description (e.g. Scan is illegible, please re-upload)"
                            className="border border-slate-300 bg-white p-3.5 rounded-lg shadow-sm focus:border-blue-500 outline-none text-sm w-full font-medium text-slate-800 transition-all"
                            value={queryData.queryMessage}
                            onChange={(e) => setQueryData({ ...queryData, queryMessage: e.target.value })}
                        />
                        <button onClick={handleRaiseQuery} className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-lg font-bold uppercase tracking-widest text-xs shrink-0 shadow-sm transition-colors border border-slate-700">
                            Submit Flag
                        </button>
                    </div>

                    {selectedApp.application.queries?.length > 0 && (
                        <div className="bg-white p-5 rounded-xl border border-slate-200">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Audit Query Log</h4>
                            <div className="space-y-3">
                                {selectedApp.application.queries.map((q, idx) => (
                                                <div key={idx} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-sm text-slate-800">{q.queryTitle}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${q.status === 'Open' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                                            {q.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{q.queryMessage}</p>
                                                    {
                                        q.response && (
                                            <div className="mt-3 bg-white p-3 rounded-lg border border-slate-200 border-l-4 border-l-blue-500 text-xs text-slate-700 shadow-sm">
                                                <span className="font-bold text-slate-500 uppercase tracking-widest text-[9px] block mb-1">Applicant Response:</span>
                                                "{q.response}"
                                            </div>
                                        )
                                    }
                                                </div>
                                            ))}
                        </div>
                                    </div>
                                )}
        </div>
                        </div >
                    </div >
                )}
            </main >

    <style dangerouslySetInnerHTML={{
        __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
                
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
            `}} />
        </div>
    );
};

export default VerifierDashboard;
