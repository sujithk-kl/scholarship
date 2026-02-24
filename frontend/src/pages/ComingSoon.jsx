import { Link, useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

const ComingSoon = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-yellow-100 rounded-full">
                        <Construction className="w-12 h-12 text-yellow-600" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h1>
                <p className="text-gray-600 mb-8">
                    This feature is currently under development for the Project 2026 showcase.
                    Please check back later!
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 font-bold px-6 py-2 hover:bg-gray-100 rounded transition-colors"
                    >
                        Go Back
                    </button>
                    <Link
                        to="/"
                        className="bg-blue-600 text-white font-bold px-6 py-2 rounded hover:bg-blue-700 transition-colors shadow"
                    >
                        Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
