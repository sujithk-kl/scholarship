import React, { useState, useEffect } from 'react';
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
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Settings, Users, CreditCard, TrendingUp, Info } from 'lucide-react';

const PolicySimulator = () => {
    const navigate = useNavigate();
    const [params, setParams] = useState({
        incomeLimit: 250000,
        minMarks: 60,
        categories: ['SC', 'ST', 'OBC'],
        avgAmount: 50000
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const categoriesList = ['General', 'SC', 'ST', 'OBC', 'EWS', 'Minority'];

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/admin/simulation/simulate', params);
            setResult(data);
        } catch (error) {
            console.error(error);
            alert('Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSimulate();
    }, []);

    const toggleCategory = (cat) => {
        setParams(prev => {
            const newCats = prev.categories.includes(cat)
                ? prev.categories.filter(c => c !== cat)
                : [...prev.categories, cat];
            return { ...prev, categories: newCats };
        });
    };

    const chartData = result ? [
        { name: 'Current Policy', beneficiaries: result.summary.currentEligible, budget: result.financials.currentBudget / 1000000 },
        { name: 'Simulated Policy', beneficiaries: result.summary.simulatedEligible, budget: result.financials.simulatedBudget / 1000000 }
    ] : [];

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <button onClick={() => navigate('/admin/dashboard')} className="text-blue-600 hover:underline text-sm mb-2 block">
                            ← Back to Dashboard
                        </button>
                        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            <Settings className="text-indigo-600" size={32} />
                            Policy Impact Simulator
                        </h1>
                        <p className="text-gray-500 mt-1">Test "what-if" scenarios for scholarship eligibility models</p>
                    </div>
                    <button
                        onClick={handleSimulate}
                        disabled={loading}
                        className={`bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Simulating...' : 'Run Simulation'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls Panel */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-indigo-600" />
                                Variable Parameters
                            </h2>

                            {/* Income Cap Slider */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-700">Income Cap (₹/year)</label>
                                    <span className="text-sm font-bold text-indigo-600">₹{params.incomeLimit.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="50000"
                                    max="1000000"
                                    step="10000"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    value={params.incomeLimit}
                                    onChange={(e) => setParams({ ...params, incomeLimit: e.target.value })}
                                />
                            </div>

                            {/* Marks Slider */}
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-semibold text-gray-700">Minimum Marks (%)</label>
                                    <span className="text-sm font-bold text-indigo-600">{params.minMarks}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="35"
                                    max="95"
                                    step="5"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    value={params.minMarks}
                                    onChange={(e) => setParams({ ...params, minMarks: e.target.value })}
                                />
                            </div>

                            {/* Average Amount */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-700 block mb-2">Avg. Scholarship (₹)</label>
                                <input
                                    type="number"
                                    className="w-full border-2 border-gray-100 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                                    value={params.avgAmount}
                                    onChange={(e) => setParams({ ...params, avgAmount: e.target.value })}
                                />
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 block mb-3">Eligible Categories</label>
                                <div className="flex flex-wrap gap-2">
                                    {categoriesList.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => toggleCategory(cat)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${params.categories.includes(cat)
                                                ? 'bg-indigo-600 border-indigo-600 text-white'
                                                : 'bg-white border-gray-100 text-gray-500 hover:border-indigo-200'
                                                }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Info Tooltip */}
                        <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
                            <h3 className="text-indigo-800 font-bold text-sm flex items-center gap-2 mb-2">
                                <Info size={16} />
                                Simulation Logic
                            </h3>
                            <p className="text-xs text-indigo-700 leading-relaxed">
                                This tool performs a dry-run against the <strong>{result?.summary?.totalStudents || 0}</strong> existing student profiles in the database.
                                It calculates how many students would qualify if the new parameters were implemented today.
                            </p>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                                <div className={`absolute top-0 right-0 p-2 text-xs font-bold uppercase ${result?.summary?.difference >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {result?.summary?.difference >= 0 ? '+' : ''}{result?.summary?.difference} Beneficiaries
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">New Beneficiary Count</h3>
                                        <p className="text-4xl font-black text-gray-900">{result?.summary?.simulatedEligible || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                                <div className={`absolute top-0 right-0 p-2 text-xs font-bold uppercase ${result?.financials?.budgetImpact >= 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    Budget Shift: {result?.financials?.budgetImpact >= 0 ? '+' : ''}₹{(result?.financials?.budgetImpact || 0).toLocaleString()}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                                        <CreditCard size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Required Budget</h3>
                                        <p className="text-4xl font-black text-gray-900">₹{((result?.financials?.simulatedBudget || 0) / 1000000).toFixed(2)}M</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Charts */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-8 uppercase tracking-widest text-center">Impact Comparison</h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                        <Tooltip
                                            cursor={{ fill: '#f9fafb' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Legend iconType="circle" />
                                        <Bar dataKey="beneficiaries" name="Beneficiaries (Count)" radius={[8, 8, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={index} fill={index === 0 ? '#94a3b8' : '#6366f1'} />
                                            ))}
                                        </Bar>
                                        <Bar dataKey="budget" name="Budget (in Millions ₹)" fill="#22c55e" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Data Insight */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Summary Conclusion</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                                    <p className="text-sm text-gray-600 pt-1">
                                        Increasing the income limit to <strong>₹{(params.incomeLimit / 1000).toFixed(0)}K</strong> will
                                        {result?.summary?.difference >= 0 ? ' add ' : ' reduce '}
                                        <strong>{Math.abs(result?.summary?.difference || 0)}</strong> potential candidates.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                                    <p className="text-sm text-gray-600 pt-1">
                                        The projected budget requirement is <strong>₹{(result?.financials?.simulatedBudget / 1000000).toFixed(2)} million</strong>, which is
                                        <strong>{Math.abs((result?.financials?.budgetImpact / result?.financials?.currentBudget) * 100 || 0).toFixed(1)}%</strong>
                                        {result?.financials?.budgetImpact >= 0 ? ' higher ' : ' lower '} than current expenditure.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicySimulator;
