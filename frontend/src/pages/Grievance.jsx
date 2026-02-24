import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { ClipboardList, Send, Clock, CheckCircle2, AlertCircle, FileText, Paperclip, MessageSquare } from 'lucide-react';

const Grievance = () => {
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("Other");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/complaints/my');
            setTickets(res.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('description', message);
            formData.append('category', category);
            if (file) formData.append('attachment', file);

            const res = await api.post('/complaints/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setTickets([res.data, ...tickets]);
            setSubject("");
            setMessage("");
            setCategory("Other");
            setFile(null);
            alert("Grievance Submitted Successfully!");
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Failed to submit grievance";
            alert(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved': return 'bg-green-100 text-green-700 border-green-200';
            case 'Under Review': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-orange-100 text-orange-700 border-orange-200';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Removed redundant Navbar because NSPHeader is global in App.jsx */}

            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-900 to-red-700 py-16 text-white text-center">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
                        <MessageSquare className="w-10 h-10" />
                        Grievance & Redressal Portal
                    </h1>
                    <p className="text-red-100 max-w-2xl mx-auto text-lg leading-relaxed">
                        Formal platform for scholarship related complaints. Track your resolution progress in real-time.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 pb-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left: Form */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6 z-10">
                            <div className="bg-gray-50 p-6 border-b">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <ClipboardList className="text-red-600" />
                                    Raise a Complaint
                                </h3>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <select
                                        className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-red-500 outline-none appearance-none bg-gray-50 transition-all text-gray-900"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        required
                                    >
                                        <option value="Technical Issue">Technical Issue</option>
                                        <option value="Payment Problem">Payment Problem</option>
                                        <option value="Verification Delay">Verification Delay</option>
                                        <option value="Profile Update">Profile Update</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-red-500 outline-none bg-gray-50 transition-all font-medium text-gray-900"
                                        placeholder="Brief summary..."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                                    <textarea
                                        className="w-full border-2 border-gray-100 p-3 rounded-xl focus:border-red-500 outline-none h-40 bg-gray-50 transition-all resize-none text-gray-900"
                                        placeholder="Detailed description of your issue..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        required
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attachment (Optional)</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="grievance-file"
                                        />
                                        <label
                                            htmlFor="grievance-file"
                                            className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all text-gray-500 font-medium"
                                        >
                                            <Paperclip className="w-5 h-5" />
                                            {file ? file.name : "Attach Screenshot/PDF"}
                                        </label>
                                    </div>
                                </div>

                                <button
                                    disabled={submitting}
                                    type="submit"
                                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-black text-lg shadow-lg transition-all
                                        ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900 active:scale-95 shadow-red-200'}
                                    `}
                                >
                                    {submitting ? "Submitting..." : <><Send className="w-5 h-5" /> Submit Grievance</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right: History */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]">
                            <div className="bg-gray-50 p-6 border-b flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Clock className="text-blue-600" />
                                    Complaint History
                                </h3>
                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {tickets.length} Registered
                                </span>
                            </div>

                            <div className="p-6">
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl"></div>
                                        ))}
                                    </div>
                                ) : tickets.length === 0 ? (
                                    <div className="text-center py-20">
                                        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold text-gray-400">No complaints registered yet</h4>
                                        <p className="text-gray-400 mt-2">Any grievances you record will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {tickets.map((ticket) => (
                                            <div key={ticket._id} className="group border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all bg-white relative overflow-hidden">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 px-2 py-0.5 bg-red-50 rounded">
                                                                {ticket.category}
                                                            </span>
                                                            <span className="text-gray-400 text-xs font-medium">#{ticket._id.substring(ticket._id.length - 6)}</span>
                                                        </div>
                                                        <h4 className="text-xl font-extrabold text-gray-800">{ticket.subject}</h4>
                                                    </div>
                                                    <div className={`px-4 py-1.5 rounded-full text-xs font-black border transition-all ${getStatusColor(ticket.status)}`}>
                                                        {ticket.status}
                                                    </div>
                                                </div>

                                                <p className="text-gray-600 leading-relaxed text-sm mb-4 line-clamp-3">
                                                    {ticket.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                                        </div>
                                                        {ticket.attachment && (
                                                            <a href={`http://localhost:5000${ticket.attachment}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-blue-600 font-bold hover:underline">
                                                                <FileText className="w-3.5 h-3.5" />
                                                                View Attachment
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {ticket.adminResponse && (
                                                    <div className="mt-4 bg-green-50 rounded-xl p-4 border border-green-100">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                            <span className="text-xs font-black text-green-800 uppercase tracking-wider">Resolution Remarks</span>
                                                        </div>
                                                        <p className="text-sm text-green-700 leading-relaxed font-medium">
                                                            {ticket.adminResponse}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Grievance;
