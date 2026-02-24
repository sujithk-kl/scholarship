import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const Schemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const { data } = await api.get('/public/schemes');
                setSchemes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading Schemes...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">Available Scholarship Schemes</h1>
                <p className="text-center text-gray-600 mb-10">Explore and apply for scholarships that match your profile.</p>

                {schemes.length === 0 ? <p className="text-center text-gray-600">No active schemes found.</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schemes.map(scheme => (
                            <div key={scheme._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
                                <div className="p-6 flex-1">
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">{scheme.name}</h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{scheme.description}</p>

                                    <div className="space-y-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-blue-600">Amount:</span>
                                            <span>₹{scheme.amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-red-600">Deadline:</span>
                                            <span>{new Date(scheme.deadline).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-3 bg-gray-50 p-3 rounded text-xs">
                                            <span className="font-semibold block mb-1">Eligibility:</span>
                                            {scheme.eligibility}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                                    <button
                                        onClick={() => navigate('/student/login')}
                                        className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Schemes;
