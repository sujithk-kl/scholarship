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
import { BarChart3, PieChart as PieChartIcon, Activity, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, Clock, MapPin, Search, LineChart, ShieldCheck } from 'lucide-react';

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
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-blue-900">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="tracking-widest uppercase text-sm font-semibold text-slate-500">Aggregating System Telemetry...</p>
            </div>
        );
    }

    const pieData = summary ? [
        { name: 'Approved', value: summary.approved },
        { name: 'Rejected', value: summary.rejected },
        { name: 'Pending', value: summary.pending }
    ] : [];

    // Corporate Color Palette for Charts
    const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

    const approvalRate = summary?.total ? ((summary.approved / summary.total) * 100).toFixed(1) : 0;
    const rejectionRate = summary?.total ? ((summary.rejected / summary.total) * 100).toFixed(1) : 0;

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans text-slate-800 selection:bg-blue-600 selection:text-white pb-20 relative overflow-hidden">

            {/* Background Details */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-slate-200/50 to-transparent -z-10"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full filter blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">

                {/* Header Sequence */}
                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-10 border-b border-slate-200 pb-6 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                                <Activity size={20} />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Telemetry Overview
                            </h1>
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">System-Wide Operational Analytics</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-3 cursor-default">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-sm font-bold text-slate-800 leading-none">Optimal</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                    {/* Total Applications */}
                    <div
                        onClick={() => handleCardClick('All')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <Users size={20} />
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Gross Intake</h3>
                        <p className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-blue-900 transition-colors">{summary?.total || 0}</p>
                    </div>

                    {/* Approved */}
                    <div
                        onClick={() => handleCardClick('Approved')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-50 to-transparent -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <CheckCircle size={20} />
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cleared</h3>
                        <p className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors">{summary?.approved || 0}</p>
                    </div>

                    {/* Rejected */}
                    <div
                        onClick={() => handleCardClick('Rejected')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-red-300 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-50 to-transparent -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                                <XCircle size={20} />
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Terminated</h3>
                        <p className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-red-700 transition-colors">{summary?.rejected || 0}</p>
                    </div>

                    {/* Pending */}
                    <div
                        onClick={() => handleCardClick('Pending')}
                        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-300 hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-50 to-transparent -z-10 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </div>
                        </div>
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">In Queue</h3>
                        <p className="text-4xl font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors">{summary?.pending || 0}</p>
                    </div>

                </div>

                {/* Efficiency Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:border-blue-200 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <TrendingUp size={12} className="text-blue-500" /> Clearance Velocity
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-5xl font-black text-slate-800 tracking-tight">{approvalRate}%</p>
                                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Optimal</span>
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-200 relative z-10 group-hover:scale-105 transition-transform duration-500">
                            <CheckCircle size={40} className="text-blue-300" strokeWidth={1.5} />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex justify-between items-center relative overflow-hidden group hover:border-red-200 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-50/50 to-transparent pointer-events-none"></div>
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <TrendingDown size={12} className="text-red-500" /> Rejection Frequency
                            </h3>
                            <div className="flex items-baseline gap-2">
                                <p className="text-5xl font-black text-slate-800 tracking-tight">{rejectionRate}%</p>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-100">Monitored</span>
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-200 relative z-10 group-hover:scale-105 transition-transform duration-500">
                            <XCircle size={40} className="text-red-300" strokeWidth={1.5} />
                        </div>
                    </div>
                </div>

                {/* Data Visualizations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>

                    {/* Bar Chart Container */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 border border-indigo-100">
                                <BarChart3 size={16} />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Temporal Intake Volume</h2>
                        </div>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F1F5F9' }}
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#1E293B' }}
                                    />
                                    <Bar
                                        dataKey="applications"
                                        name="Submissions"
                                        radius={[6, 6, 0, 0]}
                                        onClick={(data) => handleCardClick(`Month: ${data.month}`)}
                                    className="cursor-pointer"
                                    >
                                    {
                                        monthlyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === monthlyData.length - 1 ? '#4F46E5' : '#94A3B8'} />
                                    ))
                                        }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart Container */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                            <PieChartIcon size={16} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Status Distribution</h2>
                    </div>
                    <div className="h-72 w-full flex justify-center items-center relative">
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black text-slate-800">{summary?.total || 0}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    onClick={(data) => handleCardClick(data.name)}
                                    className="cursor-pointer"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity" />
                                        ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex justify-center gap-6 mt-2">
                        {pieData.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Geography Matrix */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="p-8 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                        <MapPin size={16} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Geographic Density Matrix</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">District-Level Volume Mapping</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Region / District</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Submission Count</th>
                                <th className="py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/3">Relative Density</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {districtData.map((district, index) => {
                                const percentage = summary?.total ? ((district.count / summary.total) * 100).toFixed(1) : 0;
                                return (
                                    <tr
                                        key={index}
                                        onClick={() => handleCardClick(`District: ${district.district}`)}
                            className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                                        >
                            <td className="py-4 px-8 text-sm font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                                {district.district || 'Unclassified Zone'}
                            </td>
                            <td className="py-4 px-8 text-sm font-bold text-slate-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                                        {district.count}
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-8">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-black text-slate-700 w-10">{percentage}%</span>
                                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 rounded-full transition-all group-hover:bg-blue-600"
                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    );
                                })}
                    {districtData.length === 0 && (
                        <tr>
                            <td colSpan="3" className="py-12 text-center text-slate-400 font-medium text-sm">
                                Insufficient geographic data for matrix rendering.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
                </div >

            </div >

    <style dangerouslySetInnerHTML={{
        __html: `
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
            `}} />
        </div>
    );
};

export default AdminAnalytics;
