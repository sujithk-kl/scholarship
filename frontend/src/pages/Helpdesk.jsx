import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Helpdesk = () => {
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await api.get('/student/grievance/my');
            setTickets(res.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/student/grievance', {
                subject,
                description: message,
                type: 'Helpdesk'
            });
            setTickets([res.data, ...tickets]);
            setSubject("");
            setMessage("");
            alert("Ticket Submitted Successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to submit ticket");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-10">Student Helpdesk</h1>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Submit Ticket Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Submit a Ticket</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Subject</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Cannot upload income certificate"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none h-32"
                                    placeholder="Describe your issue in detail..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold transition-colors">
                                Submit Ticket
                            </button>
                        </form>
                    </div>

                    {/* Ticket Status */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Your Tickets</h2>
                        <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
                            {loading ? (
                                <p className="text-center text-gray-500">Loading...</p>
                            ) : tickets.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No tickets found.</p>
                            ) : tickets.map((ticket) => (
                                <div key={ticket._id} className="border rounded-lg p-4 flex justify-between items-start hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-700 text-sm">{ticket.subject}</h3>
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">{ticket.type}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                                        <span className="text-xs text-gray-400">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                        {ticket.adminReply && (
                                            <div className="mt-2 bg-blue-50 p-2 rounded text-xs text-blue-800 border-l-2 border-blue-300">
                                                <strong>Admin:</strong> {ticket.adminReply}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4 flex flex-col items-end gap-2">
                                        <span className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Helpdesk;
