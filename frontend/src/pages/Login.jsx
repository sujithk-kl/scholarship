import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import CampusAI from '../components/CampusAI';
import OtpInput from '../components/OtpInput';

const Login = () => {
    const { sendOtp, verifyOtp } = useContext(AuthContext);
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSendOtp = async () => {
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-sm relative">
            {/* NSP Header */}
            <header className="bg-white px-4 py-2 shadow-sm flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <img src="https://scholarships.gov.in/public/assets/img/new-logo.png" alt="Govt Logo" className="h-12 object-contain" onError={(e) => e.target.style.display = 'none'} />
                    <div className="flex flex-col">
                        <span className="text-2xl font-bold text-gray-800 tracking-tight">Smart Scholarship Portal</span>
                        <span className="text-xs text-gray-500 font-semibold">Student Welfare Department, College Administration</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm font-semibold text-gray-600">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <button className="flex items-center gap-1 hover:text-blue-600">Helpdesk 🎧</button>
                </div>
            </header>


            <div className="flex-1 container mx-auto p-4 md:p-8 flex items-center justify-center">
                <div className="flex flex-col md:flex-row gap-8 bg-white p-6 md:p-10 rounded-2xl shadow-lg border max-w-4xl w-full">

                    {/* Left Side: Login Tips */}
                    <div className="w-full md:w-1/2 p-4">
                        <h2 className="text-xl font-bold text-gray-700 mb-6 border-b pb-2">📋 Login Tips</h2>
                        <ul className="space-y-4 text-sm text-gray-600 leading-relaxed list-decimal pl-5">
                            <li>Use the <strong>email or mobile number</strong> you registered with to receive your OTP.</li>
                            <li>OTP is valid for <strong>10 minutes</strong>. Request a new one if it expires.</li>
                            <li>If you haven't registered yet, click <strong>"Register"</strong> below to create an account first.</li>
                            <li>No password is required — OTP is the only authentication method.</li>
                            <li>After successful login, you'll be redirected to your dashboard based on your role.</li>
                        </ul>

                        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-blue-700 font-bold mb-2">📌 Demo Accounts:</p>
                            <div className="grid grid-cols-1 gap-1 text-xs text-blue-600">
                                <div><span className="font-bold">Student:</span> student@example.com</div>
                                <div><span className="font-bold">Admin:</span> admin@nsp.gov.in</div>
                                <div><span className="font-bold">Verifier:</span> verifier@nsp.gov.in</div>
                                <div className="text-[10px] mt-1 text-blue-500">OTP for all: <span className="font-bold">123456</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: OTP Login Form */}
                    <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l pt-6 md:pt-0 pl-0 md:pl-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white text-lg">🔐</div>
                            <h3 className="text-xl font-bold text-gray-800">Login with OTP</h3>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200 flex items-center gap-2">
                                <span>⚠️</span> {error}
                            </div>
                        )}

                        {successMsg && !error && (
                            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200 flex items-center gap-2">
                                <span>✅</span> {successMsg}
                            </div>
                        )}

                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            {/* Email Input */}
                            <div>
                                <label className="block text-gray-700 text-xs font-bold mb-2">
                                    Email or Mobile Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`w-full border-2 p-3 rounded-lg outline-none transition-all ${otpSent ? 'bg-gray-100 border-gray-200 text-gray-500' : 'focus:border-green-500 border-gray-200'}`}
                                    placeholder="Enter registered email or mobile"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    disabled={otpSent}
                                    required
                                />
                            </div>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            Sending OTP...
                                        </span>
                                    ) : 'Send OTP'}
                                </button>
                            ) : (
                                <div className="space-y-5 animate-fade-in">
                                    {/* OTP Input */}
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold mb-2">
                                            Enter 6-digit OTP <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex justify-center">
                                            <OtpInput length={6} onComplete={setOtp} />
                                        </div>
                                    </div>

                                    {/* Resend OTP */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            className="text-xs text-blue-600 hover:underline font-semibold"
                                        >
                                            Didn't receive OTP? Resend
                                        </button>
                                    </div>

                                    {/* Change Email */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => { setOtpSent(false); setOtp(''); setError(null); setSuccessMsg(''); }}
                                            className="text-xs text-gray-500 hover:underline"
                                        >
                                            ← Change identifier
                                        </button>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading || otp.length < 6}
                                        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Verifying...
                                            </span>
                                        ) : 'Login'}
                                    </button>
                                </div>
                            )}
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-500">
                                New user?{' '}
                                <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <CampusAI />
        </div>
    );
};

export default Login;
