import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CampusAI from '../components/CampusAI';
import OtpInput from '../components/OtpInput';
import { ArrowLeft, HelpCircle } from 'lucide-react';

const Login = () => {
    const { sendOtp, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [showTips, setShowTips] = useState(false);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (!identifier) {
            setError('Please enter your email or mobile number.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await sendOtp(identifier);
            setOtpSent(true);
            setSuccessMsg('OTP sent successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            setError('Please enter the complete 6-digit OTP.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const user = await verifyOtp(identifier, otp);
            // Redirect based on role
            if (user.role === 'Admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'Verifier') {
                navigate('/verifier/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setOtp('');
        setError(null);
        await handleSendOtp();
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 flex">
            {/* Left Side: Editorial/Classic Image Banner (Hidden on very small screens) */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=2070&auto=format&fit=crop"
                    alt="University Library"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>

                <div className="relative z-10 p-16 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-serif text-2xl font-bold tracking-tighter text-gray-900">
                                SS
                            </div>
                            <span className="text-xl font-medium tracking-wide text-white/90 uppercase letter-spacing-2">Portal</span>
                        </div>

                        <h1 className="text-5xl font-serif text-white leading-tight mb-6">
                            Smart <br />
                            Scholarship <br />
                            Management.
                        </h1>
                        <p className="text-gray-300 text-lg max-w-md leading-relaxed font-light">
                            Empowering academic excellence through streamlined financial assistance and transparent processes.
                        </p>
                    </div>

                    <div className="text-sm text-gray-400 font-light tracking-wide">
                        &copy; 2026 Student Welfare Department. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side: Clean, Classic Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col relative justify-center">
                {/* Minimalist Top Nav */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </button>

                    <div className="text-sm font-medium text-gray-500">
                        Don't have an account? <Link to="/register" className="text-gray-900 hover:underline border-b border-gray-900 pb-0.5 ml-1">Register</Link>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto px-6 py-12">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-serif text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-sm text-sm mb-6 border-l-4 border-red-500 font-medium">
                            {error}
                        </div>
                    )}

                    {successMsg && !error && (
                        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-sm text-sm mb-6 border-l-4 border-emerald-500 font-medium">
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
                        {/* Identifier Input */}
                        <div>
                            <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">
                                Email / Mobile Number
                            </label>
                            <input
                                type="text"
                                className={`w-full bg-transparent border-b-2 py-3 outline-none transition-all font-medium text-base ${otpSent ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 focus:border-gray-900 text-gray-900'}`}
                                placeholder="Enter your registered identifier"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={otpSent}
                                required
                            />
                        </div>

                        {/* OTP Input Section (Animated reveal) */}
                        {otpSent && (
                            <div className="animate-fade-in-up pt-4">
                                <label className="block text-gray-700 text-xs font-semibold uppercase tracking-wider mb-4">
                                    One-Time Password
                                </label>
                                <div className="flex justify-center mb-4">
                                    {/* Sub-component for custom brutalist OTP styling */}
                                    <OtpInput length={6} onComplete={setOtp} />
                                </div>
                                <div className="flex justify-between items-center text-xs mt-4">
                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtp(''); setError(null); setSuccessMsg(''); }}
                                        className="text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                    >
                                        Change Identifier
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        className="text-gray-900 font-bold hover:underline"
                                    >
                                        Resend Code
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Main Action Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading || (otpSent && otp.length < 6)}
                                className="w-full bg-gray-900 text-white py-4 font-semibold tracking-wide hover:bg-black transition-all disabled:bg-gray-300 disabled:cursor-not-allowed uppercase text-sm"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Processing
                                    </span>
                                ) : otpSent ? 'Secure Login' : 'Continue with OTP'}
                            </button>
                        </div>
                    </form>

                    {/* Classic Help/Tips Accordion */}
                    <div className="mt-12 border-t border-gray-200 pt-6">
                        <button
                            onClick={() => setShowTips(!showTips)}
                            className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            <span className="flex items-center"><HelpCircle className="w-4 h-4 mr-2" /> Login Help & Demo Accounts</span>
                            <span className="text-xl font-light">{showTips ? '−' : '+'}</span>
                        </button>

                        {showTips && (
                            <div className="mt-4 p-5 bg-gray-50 rounded-sm border border-gray-100 text-xs text-gray-600 leading-relaxed animate-fade-in-down">
                                <p className="mb-3">We use a passwordless OTP system for enhanced security. The OTP is valid for 10 minutes.</p>
                                <div className="font-mono text-gray-800 bg-white p-3 border border-gray-200">
                                    <p className="font-semibold mb-2 uppercase tracking-wide text-[10px] text-gray-500">Demo Accounts</p>
                                    <p>Stu: student@example.com</p>
                                    <p>Adm: admin@nsp.gov.in</p>
                                    <p>Ver: verifier@nsp.gov.in</p>
                                    <p className="mt-2 pt-2 border-t border-gray-100 text-gray-900 font-bold">OTP: 123456</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CampusAI />
        </div>
    );
};

export default Login;
