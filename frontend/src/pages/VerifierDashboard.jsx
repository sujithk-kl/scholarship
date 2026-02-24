import { useEffect, useState } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import AIVerificationBadge from '../components/AIVerificationBadge';
import { Cpu, RotateCw } from 'lucide-react';

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
            alert('Query Raised');
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

    if (loading) return <div>Loading...</div>;

    return (
        <div className="bg-scholarship container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Verifier Dashboard</h1>

            {!selectedApp ? (
                <div className="bg-white p-6 rounded shadow-md">
                    <h2 className="text-xl font-bold mb-4">Assigned Applications</h2>
                    {applications.length === 0 ? <p>No applications pending verification.</p> : (
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Application ID</th>
                                    <th className="p-2">Student Name</th>
                                    <th className="p-2">Application Type</th>
                                    <th className="p-2">AI Score</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{app._id}</td>
                                        <td className="p-2">{app.student?.name}</td>
                                        <td className="p-2">{app.applicationType}</td>
                                        <td className="p-2">
                                            <AIVerificationBadge score={app.aiVerificationScore} showLabel={false} />
                                        </td>
                                        <td className="p-2"><StatusBadge status={app.currentStatus} /></td>
                                        <td className="p-2">
                                            <button
                                                onClick={() => fetchAppDetails(app._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            ) : (
                <div className="bg-white p-6 rounded shadow-md">
                    <button onClick={() => setSelectedApp(null)} className="mb-4 text-blue-500 underline">&larr; Back to List</button>

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Review Application</h2>
                            <p className="text-gray-600">Student: {selectedApp.application.student?.name}</p>
                            <p className="text-gray-600">Type: <span className="font-semibold">{selectedApp.application.applicationType}</span></p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={handleAICheck}
                                disabled={isVerifying}
                                className={`flex items-center gap-2 px-4 py-2 rounded shadow font-bold transition-all ${isVerifying ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                            >
                                {isVerifying ? <RotateCw className="animate-spin" size={18} /> : <Cpu size={18} />}
                                {isVerifying ? 'Analyzing...' : 'Run AI Fraud Check'}
                            </button>
                            <AIVerificationBadge score={selectedApp.application.aiVerificationScore} />
                            <button onClick={handleForward} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-bold">
                                Forward to Admin
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="border p-4 rounded">
                            <h3 className="font-bold mb-2">Personal Details</h3>
                            <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(selectedApp.application.profile?.personalDetails, null, 2)}</pre>
                        </div>
                        <div className="border p-4 rounded">
                            <h3 className="font-bold mb-2">Documents</h3>
                            <div className="space-y-4">
                                {selectedApp.documents && selectedApp.documents.length > 0 ? (
                                    selectedApp.documents.map(doc => {
                                        // Get icon based on document type
                                        const getDocIcon = (type) => {
                                            const icons = {
                                                'Aadhar Card': '🆔',
                                                'Income Certificate': '💰',
                                                'Caste Certificate': '📋',
                                                'Bank Passbook': '🏦',
                                                'Academic Marksheet': '📚',
                                                'Domicile Certificate': '🏠',
                                                'General Document': '📄'
                                            };
                                            return icons[type] || '📄';
                                        };

                                        // Build full URL for document viewing
                                        const apiBaseUrl = 'http://localhost:5000';
                                        const documentUrl = `${apiBaseUrl}${doc.fileUrl}`;

                                        return (
                                            <div key={doc._id} className="flex justify-between items-center border p-3 rounded hover:bg-gray-50 transition">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <span className="text-2xl">{getDocIcon(doc.documentType)}</span>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">{doc.documentType}</div>
                                                        <div className="text-xs text-gray-500">
                                                            {doc.createdAt && `Uploaded: ${new Date(doc.createdAt).toLocaleDateString()}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex gap-2">
                                                        <a
                                                            href={documentUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                                        >
                                                            View
                                                        </a>
                                                        <a
                                                            href={documentUrl}
                                                            download
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                                                        >
                                                            Download
                                                        </a>
                                                    </div>
                                                    <div className="border-l pl-3 min-w-[120px]">
                                                        {doc.verificationStatus === 'Pending' ? (
                                                            <div className="flex gap-1">
                                                                <button
                                                                    onClick={() => handleVerifyDoc(doc._id, 'Approved')}
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                                                >
                                                                    ✓ Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleVerifyDoc(doc._id, 'Rejected')}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                                                                >
                                                                    ✗ Reject
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className={`inline-block px-3 py-1 rounded text-xs font-bold ${doc.verificationStatus === 'Approved'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-red-100 text-red-700'
                                                                }`}>
                                                                {doc.verificationStatus === 'Approved' ? '✓ ' : '✗ '}
                                                                {doc.verificationStatus}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-4xl mb-2">📭</p>
                                        <p className="italic">No documents uploaded by student.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="font-bold mb-4">Raise Query</h3>
                        <div className="flex gap-4 mb-4">
                            <input
                                placeholder="Field Name / Document Name"
                                className="border p-2 w-1/3 rounded"
                                value={queryData.fieldName}
                                onChange={(e) => setQueryData({ ...queryData, fieldName: e.target.value })}
                            />
                            <input
                                placeholder="Query Message (e.g., Image blurred)"
                                className="border p-2 w-full rounded"
                                value={queryData.queryMessage}
                                onChange={(e) => setQueryData({ ...queryData, queryMessage: e.target.value })}
                            />
                            <button onClick={handleRaiseQuery} className="bg-orange-500 text-white px-4 py-2 rounded shrink-0">
                                Raise Query
                            </button>
                        </div>

                        {selectedApp.application.queries?.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded">
                                <h4 className="font-semibold mb-2">Query History</h4>
                                <ul className="list-disc pl-5">
                                    {selectedApp.application.queries.map((q, idx) => (
                                        <li key={idx} className="text-sm mb-1">
                                            <span className="font-bold">{q.queryTitle}:</span> {q.queryMessage}
                                            <span className={`text-xs ml-2 px-1 rounded ${q.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {q.status}
                                            </span>
                                            {q.response && (
                                                <div className="ml-4 mt-1 text-gray-600 bg-white p-1 rounded border-l-2 border-green-500 text-xs">
                                                    Response: {q.response}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifierDashboard;
