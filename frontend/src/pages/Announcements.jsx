import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const Announcements = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const { data } = await api.get('/public/announcements');
                setUpdates(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnnouncements();
    }, []);

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading Announcements...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-5xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Latest Announcements</h1>

                {updates.length === 0 ? <p className="text-center text-gray-600">No active announcements.</p> : (
                    <div className="grid gap-6">
                        {updates.map((update, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition-shadow">
                                <div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded text-white mb-2 inline-block ${update.type === 'Alert' ? 'bg-red-500' : update.type === 'Important' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                                        {update.type}
                                    </span>
                                    <h2 className="text-xl font-bold text-gray-800 mb-1">{update.title}</h2>
                                    <p className="text-gray-600 text-sm">{update.content}</p>
                                </div>
                                <div className="mt-4 md:mt-0 text-right min-w-[100px]">
                                    <span className="text-xs text-gray-400 font-semibold">{update.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Announcements;
