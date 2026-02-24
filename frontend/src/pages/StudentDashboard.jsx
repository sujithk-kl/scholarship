import { useEffect, useState } from 'react';
import api from '../services/api';
import ApplicationForm from '../components/ApplicationForm';
import StatusBadge from '../components/StatusBadge';
import StatusTimeline from '../components/StatusTimeline';

import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { FileText, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle, Bell, Sparkles } from 'lucide-react';

const socket = io('http://localhost:5000');

const getNotificationSubMessage = (status) => {
    switch (status) {
        case 'Approved': return 'Congratulations! Your scholarship is ready.';
        case 'Rejected': return 'We regret to inform you that your app was rejected.';
        case 'Under Review': return 'Great! Your app is now being reviewed by Admin.';
        case 'Query Raised': return 'Action Needed: Check the queries below.';
        default: return 'Your application progress has been updated.';
    }
};

const StudentDashboard = () => {
    const [application, setApplication] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isResubmitting, setIsResubmitting] = useState(false);
    const [isRenewing, setIsRenewing] = useState(false);

    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [notification, setNotification] = useState(null);
    const [officialCampaigns, setOfficialCampaigns] = useState([]);
    const [myCampaigns, setMyCampaigns] = useState([]);

    const navigate = useNavigate();

    const fetchStatus = async () => {
        try {
            const { data } = await api.get('/student/status');
            setApplication(data.application);
            setDocuments(data.documents || []);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setApplication(null); // No application found, show form
            } else {
                console.error(error);
                alert("Failed to fetch dashboard data");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficialCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/campaigns');
            const official = data.filter(c => c.isOfficial);
            setOfficialCampaigns(official);
        } catch (error) {
            console.error('Failed to fetch official campaigns', error);
        }
    };

    const fetchMyCampaigns = async () => {
        try {
            const { data } = await api.get('/crowdfund/my');
            setMyCampaigns(data);
        } catch (error) {
            console.error('Failed to fetch my campaigns', error);
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            await api.post('/student/withdraw', { amount: withdrawAmount });
            alert('Funds Withdrawn Successfully!');
            setWithdrawAmount(''); // Clear input
            fetchStatus();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Withdrawal Failed');
        }
    };

    useEffect(() => {
        fetchStatus();
        fetchOfficialCampaigns();
        fetchMyCampaigns();

        // Socket.io
        const studentUser = localStorage.getItem('studentUser');
        const user = localStorage.getItem('user'); // Check general user too
        const activeUser = studentUser ? JSON.parse(studentUser) : user ? JSON.parse(user) : null;

        if (activeUser && activeUser._id) {
            console.log('Joining socket room:', activeUser._id);
            socket.emit('join_room', activeUser._id);

            socket.on('status_update', (newStatus) => {
                console.log('Real-time status update received:', newStatus);

                // Refresh local state
                setApplication(prev => prev ? ({ ...prev, currentStatus: newStatus }) : prev);

                // Show high-impact floating notification
                setNotification({
                    message: `${newStatus}`,
                    subMessage: getNotificationSubMessage(newStatus),
                    type: newStatus === 'Approved' ? 'success' : newStatus === 'Rejected' ? 'error' : 'info'
                });

                // Hide after delay
                setTimeout(() => setNotification(null), 8000);

                fetchStatus(); // Full refresh to get all related data
                fetchMyCampaigns(); // Refresh campaign progress on donation
            });
        }

        return () => {
            socket.off('status_update');
        };
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (showSuccess) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md w-full border-t-4 border-green-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-8">Your scholarship application has been successfully submitted and is now under verification.</p>
                    <button
                        onClick={() => {
                            setShowSuccess(false);
                            fetchStatus();
                        }}
                        className="bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 transition w-full shadow-lg"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isResubmitting) {
        return (
            <div className="container mx-auto p-8">
                <button onClick={() => setIsResubmitting(false)} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                <ApplicationForm
                    initialData={application.profile}
                    isResubmission={true}
                    onSuccess={() => {
                        setIsResubmitting(false);
                        fetchStatus();
                    }}
                />
            </div>
        );
    }

    if (isRenewing) {
        return (
            <div className="container mx-auto p-8">
                <button onClick={() => setIsRenewing(false)} className="mb-4 text-blue-600 hover:underline">&larr; Back to Dashboard</button>
                <ApplicationForm
                    initialData={application.profile}
                    isRenewal={true}
                    onSuccess={() => {
                        setIsRenewing(false);
                        fetchStatus();
                    }}
                />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto p-8">
                <h1 className="text-3xl font-bold mb-6 text-indigo-900">Student Dashboard</h1>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                    <p className="font-bold text-blue-800">Welcome! Please complete your profile and submit the application below.</p>
                </div>
                <ApplicationForm onSuccess={() => {
                    setShowSuccess(true);
                    fetchStatus(); // Refresh dashboard immediately
                }} />
            </div>
        );
    }

    return (
        <div className="bg-scholarship container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-indigo-900">Student Dashboard</h1>
                <button
                    onClick={() => navigate('/student/recommendations')}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                    <Sparkles size={20} />
                    View AI Matches
                </button>
            </div>

            {/* Eligibility Banner from Auto-Checker */}
            {application?.eligibilityStatus && (
                <div className={`mb-6 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border ${application.eligibilityStatus === 'Eligible' ? 'bg-green-100 text-green-800 border-green-300' :
                    application.eligibilityStatus === 'Not Eligible' ? 'bg-red-100 text-red-800 border-red-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                    }`}>
                    <div className="flex items-center gap-3">
                        {application.eligibilityStatus === 'Eligible' ? <CheckCircle size={24} /> : application.eligibilityStatus === 'Not Eligible' ? <XCircle size={24} /> : <Clock size={24} />}
                        <div>
                            <h3 className="font-bold text-lg">Eligibility Check: {application.eligibilityStatus}</h3>
                            <p className="text-sm">Based on automatic analysis of your profile.</p>
                        </div>
                    </div>
                    {application.eligibilityStatus === 'Not Eligible' && (
                        <button
                            onClick={() => navigate('/crowdfunding')}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 shadow-md transition-all whitespace-nowrap"
                        >
                            🤝 Start Crowdfund Campaign
                        </button>
                    )}
                </div>
            )}

            {/* My Active Crowdfunding Campaign */}
            {myCampaigns.filter(c => c.status === 'Active').map(campaign => (
                <div key={campaign._id} className="mb-8 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden text-white border-2 border-indigo-400/30">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Your Crowdfunding Journey</h2>
                                <p className="text-indigo-200 text-sm font-medium">#{campaign.title}</p>
                            </div>
                            <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10 text-center">
                                <p className="text-[10px] uppercase font-black text-indigo-300">Goal Amount</p>
                                <p className="text-xl font-black">₹{campaign.goalAmount?.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs uppercase font-bold text-indigo-300 mb-1">Raised So Far</p>
                                <p className="text-3xl font-black text-green-400">₹{campaign.raisedAmount?.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs uppercase font-bold text-indigo-300 mb-1">Total Donors</p>
                                <p className="text-3xl font-black text-indigo-50">{campaign.donors?.length || 0}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs uppercase font-bold text-indigo-300 mb-1">Target Gap</p>
                                <p className="text-3xl font-black text-orange-400">₹{(campaign.goalAmount - campaign.raisedAmount).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Professional Progress Bar */}
                        <div className="mb-4">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-sm font-bold text-indigo-200">{Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}% Completed</span>
                                <span className="text-xs font-medium text-white/50 italic">Updates in real-time on donation</span>
                            </div>
                            <div className="h-4 bg-white/10 rounded-full border border-white/5 p-1">
                                <div
                                    className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-300 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(74,222,128,0.4)]"
                                    style={{ width: `${Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Official Crowdfunding Section */}
            {officialCampaigns.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="bg-yellow-400 p-1.5 rounded-lg shadow-sm">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Special Government/NGO Sponsorships</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {officialCampaigns.map(campaign => (
                            <div key={campaign._id} className="bg-white rounded-xl border-2 border-yellow-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group" onClick={() => navigate('/crowdfunding')}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Official Fund</span>
                                    <span className="text-green-600 font-bold text-sm">₹{campaign.goalAmount?.toLocaleString()}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{campaign.title}</h3>
                                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{campaign.story}</p>
                                <div className="mt-3 flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200"></div>
                                        ))}
                                        <div className="flex items-center justify-center text-[10px] text-gray-500 ml-4">+ {campaign.donors?.length || 0} supporters</div>
                                    </div>
                                    <button className="text-indigo-600 font-bold text-xs group-hover:underline">View Details →</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Powerful Real-time Notification Popup */}
            {notification && (
                <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
                    <div className={`
                        flex items-center gap-4 p-5 rounded-2xl shadow-2xl border-2 animate-bounce-in
                        ${notification.type === 'success' ? 'bg-white border-green-500 text-green-800' :
                            notification.type === 'error' ? 'bg-white border-red-500 text-red-800' :
                                'bg-white border-blue-500 text-blue-800'
                        }
                    `}>
                        <div className={`p-3 rounded-full ${notification.type === 'success' ? 'bg-green-100' : notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'}`}>
                            <Bell className={notification.type === 'success' ? 'text-green-600' : notification.type === 'error' ? 'text-red-600' : 'text-blue-600'} />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-extrabold text-sm uppercase tracking-wider">Status Update</h4>
                            <p className="text-xl font-black">{notification.message}</p>
                            <p className="text-xs opacity-75 mt-1">{notification.subMessage}</p>
                        </div>
                        <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                    </div>
                </div>
            )}

            {/* Expiry Alerts */}
            {documents.some(d => d.verificationStatus === 'Expired' || d.reuploadRequired) && (
                <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-2xl p-6 shadow-xl animate-pulse">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-red-500 p-2 rounded-full text-white">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-red-800 uppercase tracking-tight">Action Required: Document Expired</h3>
                            <p className="text-red-600 font-medium">One or more of your documents have expired. Re-upload immediately to maintain eligibility.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {documents.filter(d => d.verificationStatus === 'Expired' || d.reuploadRequired).map(doc => (
                            <div key={doc._id} className="bg-white p-4 rounded-xl border border-red-100 flex justify-between items-center">
                                <div>
                                    <span className="text-xs font-black text-red-500 uppercase">{doc.documentType}</span>
                                    <p className="text-gray-500 text-xs">Expired on: {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : 'Unknown'}</p>
                                </div>
                                <label className="bg-red-800 text-white px-6 py-2 rounded-lg font-black text-sm cursor-pointer hover:bg-red-900 transition-all active:scale-95 shadow-lg shadow-red-100">
                                    Re-upload New
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append('document', file);
                                            try {
                                                await api.put(`/student/reupload/${doc._id}`, formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                alert(`${doc.documentType} re-uploaded!`);
                                                fetchStatus();
                                            } catch (err) {
                                                alert('Re-upload failed');
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Timeline Progress Component */}
            <StatusTimeline currentStatus={application?.currentStatus} />

            <div className="bg-white p-6 rounded shadow-md mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Application Status</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={async () => {
                                if (confirm('Are you sure you want to RESET your application? This will delete all your data and allow you to apply again.')) {
                                    try {
                                        await api.delete('/student/reset');
                                        window.location.reload();
                                    } catch (e) {
                                        alert('Failed to reset');
                                    }
                                }
                            }}
                            className="bg-red-100 text-red-600 px-3 py-1 rounded text-xs font-bold hover:bg-red-200"
                        >
                            Reset App
                        </button>
                        <StatusBadge status={application.currentStatus} />
                    </div>
                </div>
                <p><strong>Application ID:</strong> {application._id}</p>
                <p><strong>Application Type:</strong> {application.applicationType}</p>
                <p><strong>Verification Stage:</strong> {application.verificationStage}</p>
                <p><strong>Submitted On:</strong> {new Date(application.createdAt).toLocaleString()}</p>
                {application.currentStatus === 'Approved' && (
                    <>
                        <p className="mt-2"><strong>Current Status:</strong> <span className="text-green-600 font-bold">{application.currentStatus}</span></p>
                        {application.approvedAt && <p><strong>Approved On:</strong> {new Date(application.approvedAt).toLocaleString()}</p>}
                    </>
                )}
                {application.currentStatus === 'Approved' && (
                    <div className="mt-4 border-t pt-4">
                        <div className="mb-4">
                            <p className="text-lg font-bold text-gray-700">Total Scholarship: ₹{application.scholarshipAmount}</p>
                            <p className="text-xl font-bold text-green-700">Available Balance: ₹{application.scholarshipAmount - (application.withdrawnAmount || 0)}</p>
                            <p className="text-sm text-gray-500">Already Withdrawn: ₹{application.withdrawnAmount || 0}</p>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded text-sm font-bold ${application.withdrawalStatus === 'Partially Withdrawn' ? 'bg-yellow-200 text-yellow-800' :
                                    application.withdrawalStatus === 'Fully Withdrawn' ? 'bg-green-200 text-green-800' :
                                        'bg-gray-200 text-gray-800'
                                    }`}>
                                    Withdrawal Status: {application.withdrawalStatus}
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">Crediting to Account: <strong>{application.profile?.financialDetails?.bankAccountNo || 'N/A'}</strong></p>

                        {(application.withdrawalStatus === 'Available' || application.withdrawalStatus === 'Partially Withdrawn') ? (
                            <div className="mt-4">
                                <input
                                    type="number"
                                    placeholder="Enter Amount to Withdraw"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="border p-2 rounded mr-2 w-64"
                                />
                                <button
                                    onClick={handleWithdraw}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                >
                                    Withdraw Funds
                                </button>
                            </div>
                        ) : application.withdrawalStatus === 'Fully Withdrawn' ? (
                            <div className="flex items-center text-green-700 bg-green-50 p-3 rounded border border-green-200">
                                <span className="text-xl mr-2">✓</span>
                                <div>
                                    <p className="font-bold">All Funds Withdrawn</p>
                                    <p className="text-xs">You have fully utilized your scholarship.</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {application.currentStatus === 'Approved' && (
                    <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-bold mb-2">Scholarship Renewal</h3>
                        <p className="mb-4 text-gray-600">You can apply for a renewal for the next academic year if you meet the criteria.</p>
                        <button
                            onClick={() => setIsRenewing(true)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Apply for Renewal
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold mb-4">Uploaded Documents</h2>
                <div className="grid gap-4">
                    {documents?.length > 0 ? documents.map(doc => (
                        <div key={doc._id} className="border p-4 rounded flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{doc.documentType}</p>
                                <a href={`http://localhost:5000${doc.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-sm">View File</a>
                            </div>
                            <div className="text-right">
                                <span className={`text-sm font-bold ${doc.verificationStatus === 'Approved' ? 'text-green-600' : doc.verificationStatus === 'Rejected' ? 'text-red-600' : 'text-gray-600'}`}>
                                    {doc.verificationStatus}
                                </span>
                                {doc.remarks && <p className="text-sm text-red-500 mt-1">Remark: {doc.remarks}</p>}
                            </div>
                        </div>
                    )) : <p className="text-gray-500 italic">No documents uploaded.</p>}
                </div>
            </div>

            {/* Query Section */}
            {application.queries && application.queries.length > 0 && (
                <div className="bg-orange-50 p-6 rounded shadow-md mb-6 border-l-4 border-orange-500">
                    <h2 className="text-xl font-bold text-orange-800 mb-4">Verification Queries</h2>
                    <div className="space-y-4">
                        {application.queries.map((query, index) => (
                            <div key={index} className="bg-white p-4 rounded border shadow-sm">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-800">{query.queryTitle}</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${query.status === 'Open' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        {query.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mt-2 text-sm">{query.queryMessage}</p>
                                <p className="text-xs text-gray-400 mt-2">Raised on: {new Date(query.raisedAt).toLocaleString()}</p>

                                {query.response && (
                                    <div className="mt-3 bg-gray-50 p-2 rounded text-sm border-l-2 border-green-500">
                                        <p className="font-bold text-gray-700">Your Response:</p>
                                        <p className="text-gray-600">{query.response}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Show Resubmit Button if there are OPEN queries */}
                    {application.queries.some(q => q.status === 'Open') && (
                        <div className="mt-6">
                            <h3 className="font-bold text-gray-700 mb-2">Action Required</h3>
                            <p className="text-sm text-gray-600 mb-4">Please address the queries above by updating your application or documents and resubmitting.</p>
                            <button
                                onClick={() => setIsResubmitting(true)}
                                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition shadow"
                            >
                                Edit & Resubmit Application
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
