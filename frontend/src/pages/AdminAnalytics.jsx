import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer
} from 'recharts';

const AdminAnalytics = () => {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryRes, monthlyRes, districtRes] = await Promise.all([
                    api.get('/analytics/summary'),
                    api.get('/analytics/monthly'),
                    api.get('/analytics/district')
                ]);

                setSummary(summaryRes.data);
                setMonthlyData(monthlyRes.data);
                setDistrictData(districtRes.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching analytics:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCardClick = (filter) => {
        navigate('/admin/dashboard', { state: { filter } });
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading Analytics...</div>;
    }

    const pieData = summary ? [
        { name: 'Approved', value: summary.approved },
        { name: 'Rejected', value: summary.rejected },
        { name: 'Pending', value: summary.pending }
    ] : [];

    const COLORS = ['#0088FE', '#FF8042', '#FFBB28'];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Analytics Dashboard</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    onClick={() => handleCardClick('All')}
                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 cursor-pointer hover:scale-105 transition-transform"
                >
                    <h3 className="text-gray-500 text-sm uppercase">Total Applications</h3>
                    <p className="text-3xl font-bold text-gray-800">{summary?.total || 0}</p>
                </div>
                <div
                    onClick={() => handleCardClick('Approved')}
                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 cursor-pointer hover:scale-105 transition-transform"
                >
                    <h3 className="text-gray-500 text-sm uppercase">Approved</h3>
                    <p className="text-3xl font-bold text-gray-800">{summary?.approved || 0}</p>
                </div>
                <div
                    onClick={() => handleCardClick('Rejected')}
                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500 cursor-pointer hover:scale-105 transition-transform"
                >
                    <h3 className="text-gray-500 text-sm uppercase">Rejected</h3>
                    <p className="text-3xl font-bold text-gray-800">{summary?.rejected || 0}</p>
                </div>
                <div
                    onClick={() => handleCardClick('Pending')}
                    className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 cursor-pointer hover:scale-105 transition-transform"
                >
                    <h3 className="text-gray-500 text-sm uppercase">Pending</h3>
                    <p className="text-3xl font-bold text-gray-800">{summary?.pending || 0}</p>
                </div>
            </div>

            {/* Powerful Stats Injection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div>
                        <h3 className="text-blue-600 font-bold uppercase text-xs">Approval Rate</h3>
                        <p className="text-4xl font-extrabold text-blue-800">
                            {summary?.total ? ((summary.approved / summary.total) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                    <div className="text-blue-200">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center bg-gradient-to-r from-red-50 to-white">
                    <div>
                        <h3 className="text-red-600 font-bold uppercase text-xs">Rejection Rate</h3>
                        <p className="text-4xl font-extrabold text-red-800">
                            {summary?.total ? ((summary.rejected / summary.total) * 100).toFixed(1) : 0}%
                        </p>
                    </div>
                    <div className="text-red-200">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                </div>
            </div>


            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Monthly Trends */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Monthly Application Trends</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey="applications"
                                    fill="#8884d8"
                                    name="Applications"
                                    onClick={(data) => handleCardClick(`Month: ${data.month}`)}
                                    className="cursor-pointer"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Application Status Distribution</h2>
                    <div className="h-80 flex justify-center items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onClick={(data) => handleCardClick(data.name)}
                                    className="cursor-pointer"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* District Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4 text-gray-700">District-wise Applications</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Count</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {districtData.map((district, index) => (
                                <tr
                                    key={index}
                                    onClick={() => handleCardClick(`District: ${district.district}`)}
                                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.district || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {((district.count / summary?.total) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
