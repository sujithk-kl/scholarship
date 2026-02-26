import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Check, Camera, ShieldCheck, UserCircle, Building } from 'lucide-react';
import CampusAI from '../components/CampusAI';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const initialRole = 'Student';

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: initialRole, mobile: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Camera State
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    // OTR is ONLY for Students — Admin and Verifier get a direct registration form
    const isOTR = formData.role === 'Student';

    const startCamera = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.getElementById('webcam');
            if (video) {
                video.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Unable to access camera. Please allow camera permissions or use QR Code.");
            setIsCameraActive(false);
        }
    };

    const verifyFace = () => {
        setIsVerifying(true);
        setTimeout(() => {
            // Stop tracks
            const video = document.getElementById('webcam');
            const stream = video?.srcObject;
            const tracks = stream?.getTracks();
            tracks?.forEach(track => track.stop());

            setIsVerifying(false);
            setIsCameraActive(false);
            setStep(4); // Success
        }, 3000); // 3 second simulation
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role, formData.mobile);
            if (isOTR) {
                setStep(3); // Move to eKYC step on success (Student only)
            } else {
                // Admin / Verifier: direct redirect to login
                alert(`${formData.role} registered successfully! Please login.`);
                navigate('/login');
            }
        } catch (err) {
            console.error("Registration Error:", err);
            const msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    return (
        <div className="min-h-screen relative font-sans text-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-blue-200">
            {/* Soft Modern Mesh Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-white pointer-events-none -z-20"></div>

            {/* Subtle floating background orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob -z-10"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 -z-10"></div>
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000 -z-10"></div>

            {/* Top Navigation */}
            <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-semibold bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Return Home
                </button>

                <div className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/60 shadow-sm text-sm font-medium text-gray-600">
                    Existing user? <Link to="/login" className="text-blue-600 font-bold hover:underline ml-1">Log In</Link>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[600px] z-10 pt-10">

                {/* Brand Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg mb-6">
                        <span className="text-2xl font-bold tracking-tighter text-white">SS</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {isOTR ? 'Student Registration' : 'Official Portal Setup'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        {isOTR ? 'Create your One-Time Registration (OTR) profile.' : 'Establish your secure administrative credentials.'}
                    </p>
                </div>

                {/* Floating Glass Panel */}
                <div className="bg-white/70 backdrop-blur-2xl py-8 px-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-3xl sm:px-10 border border-white/60 relative overflow-hidden">

                    {/* Stepper Wizard (Inside Panel, OTR Only) */}
                    {isOTR && step < 4 && (
                        <div className="mb-10 pt-2">
                            <div className="flex items-center justify-between relative px-2 mb-2">
                                {/* Backtrack line */}
                                <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full -z-10"></div>
                                {/* Progress line */}
                                <div className={`absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full -z-10 transition-all duration-500 ease-out ${step === 2 ? 'w-[40%]' : step === 3 ? 'w-[80%]' : 'w-0'}`}></div>

                                {[
                                    { num: 1, label: 'Docs' },
                                    { num: 2, label: 'Form' },
                                    { num: 3, label: 'eKYC' }
                                ].map((s) => (
                                    <div key={s.num} className="flex flex-col items-center">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 shadow-sm ${step === s.num
                                                ? 'bg-blue-600 text-white ring-4 ring-blue-100 scale-110'
                                                : step > s.num
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-400 border-2 border-gray-100'
                                            }`}>
                                            {step > s.num ? <Check className="w-4 h-4" strokeWidth={3} /> : s.num}
                                        </div>
                                        <span className={`mt-3 text-[10px] uppercase tracking-widest font-bold font-sans transition-colors ${step >= s.num ? 'text-blue-900' : 'text-gray-400'}`}>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 border border-red-100 font-medium flex items-center gap-3 animate-fade-in-down shadow-sm">
                            <span className="text-xl">⚠️</span> {error}
                        </div>
                    )}

                    {/* Step 1 or Admin Form */}
                    {(!isOTR || step === 2) && (
                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                            {!isOTR && (
                                <div className="mb-6 bg-blue-50/50 p-2 rounded-2xl border border-blue-100 flex items-center justify-between">
                                    <div className="flex items-center gap-3 pl-3">
                                        <Building className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-bold text-blue-900">Official Role</span>
                                    </div>
                                    <select
                                        className="bg-white border-0 text-sm font-bold text-gray-700 py-2 px-4 outline-none cursor-pointer rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 transition-all"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    >
                                        <option value="Student">Switch to Student Mode</option>
                                        <option value="Verifier">Verifier</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 pl-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/80 border border-gray-200 py-3.5 px-4 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 shadow-sm"
                                        placeholder="e.g. Jane Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 pl-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full bg-white/80 border border-gray-200 py-3.5 px-4 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 shadow-sm"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 pl-1">Mobile No.</label>
                                    <input
                                        type="tel"
                                        className="w-full bg-white/80 border border-gray-200 py-3.5 px-4 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 shadow-sm"
                                        placeholder="10-digit number"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-500 text-xs font-bold uppercase tracking-wider mb-1.5 pl-1">Set Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-white/80 border border-gray-200 py-3.5 px-4 rounded-2xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-900 shadow-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-between gap-4">
                                {isOTR && (
                                    <button type="button" onClick={prevStep} className="px-6 py-3.5 rounded-2xl text-gray-600 font-bold bg-white/50 border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm text-sm">
                                        Back
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-1 bg-blue-600 text-white rounded-2xl py-3.5 font-bold tracking-wide hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md text-sm ${!isOTR ? 'w-full' : ''}`}
                                >
                                    {isLoading ? 'Processing...' : (isOTR ? 'Save Details & Continue' : 'Create Official Account')}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* OTR FLOW: Step 1 (Guidelines) */}
                    {isOTR && step === 1 && (
                        <div className="animate-fade-in space-y-6">

                            <div className="bg-white/80 border border-indigo-100 rounded-2xl p-2 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3 pl-3">
                                    <UserCircle className="w-5 h-5 text-indigo-600" />
                                    <span className="text-sm font-bold text-indigo-900">Registration Mode</span>
                                </div>
                                <select
                                    className="bg-indigo-50 border-0 text-sm font-bold text-indigo-700 py-2.5 px-4 outline-none cursor-pointer rounded-xl focus:ring-2 focus:ring-indigo-300 transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="Student">Student (OTR)</option>
                                    <option value="Verifier">Official Verifier</option>
                                    <option value="Admin">Portal Admin</option>
                                </select>
                            </div>

                            <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100 shadow-inner">
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-500" /> Pre-requisites
                                </h3>
                                <ul className="space-y-4 text-sm text-gray-600">
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-gray-900">Mandatory Core:</strong> OTR is fundamentally required to apply for any scholarship.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-gray-900">Mobile Verification:</strong> An active personal phone number is strictly required for alerts.</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 mr-3 flex-shrink-0"></div>
                                        <span><strong className="text-gray-900">Zero Cost:</strong> This platform is entirely free. Avoid any third-party fees.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                <input type="checkbox" id="agree" className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5 cursor-pointer accent-blue-600" />
                                <label htmlFor="agree" className="text-sm text-gray-700 font-medium cursor-pointer leading-tight">
                                    I hereby confirm that I have reviewed the official guidelines mentioned above.
                                </label>
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold tracking-wide hover:bg-black hover:shadow-lg transition-all text-sm"
                            >
                                Agree & Continue
                            </button>
                        </div>
                    )}

                    {/* OTR FLOW: Step 3 (eKYC) */}
                    {isOTR && step === 3 && (
                        <div className="flex flex-col items-center animate-fade-in">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Biometric Verification</h3>
                                <p className="text-sm text-gray-500 font-medium">Position your face inside the frame to capture your baseline portrait.</p>
                            </div>

                            {/* Apple-esque Camera Wrapper (Squircle) */}
                            <div className="w-full max-w-sm aspect-square bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-2 mb-8 relative overflow-hidden group shadow-inner transition-colors focus-within:border-blue-400 focus-within:border-solid hover:border-gray-400">

                                {!isCameraActive ? (
                                    <div className="flex flex-col items-center text-gray-400 z-10 transition-transform group-hover:scale-110 duration-300">
                                        <Camera className="w-16 h-16 mb-4 opacity-50 stroke-1" />
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Lens Inactive</span>
                                    </div>
                                ) : (
                                    <div className="absolute inset-2 bg-black rounded-[2rem] overflow-hidden shadow-2xl ring-4 ring-black/5">
                                        <video
                                            id="webcam"
                                            autoPlay
                                            playsInline
                                            className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-500 ${isVerifying ? 'opacity-60 blur-[1px]' : 'opacity-100'}`}
                                            onLoadedMetadata={(e) => e.target.play()}
                                        />

                                        {/* Futuristic Minimal Scanning Overlay */}
                                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center border-[6px] border-black/20 rounded-[2rem]">
                                            <div className="w-48 h-56 border-2 border-white/60 rounded-[3rem] opacity-70"></div>

                                            {isVerifying && (
                                                <>
                                                    {/* Scanning pulse */}
                                                    <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
                                                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_20px_4px_rgba(96,165,250,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>

                                                    <div className="absolute bottom-6 bg-white/90 backdrop-blur-sm shadow-xl px-5 py-2 rounded-full border border-white flex items-center gap-3 animate-pulse">
                                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping"></div>
                                                        <span className="text-xs font-bold text-gray-900 uppercase tracking-wider mt-px">Extracting Data...</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-3">
                                {!isCameraActive ? (
                                    <button
                                        onClick={startCamera}
                                        className="w-full bg-blue-600 text-white rounded-2xl py-4 font-bold hover:bg-blue-700 transition-all shadow-md text-sm"
                                    >
                                        Enable Camera Access
                                    </button>
                                ) : (
                                    <button
                                        onClick={verifyFace}
                                        disabled={isVerifying}
                                        className={`w-full rounded-2xl py-4 font-bold transition-all text-sm flex items-center justify-center gap-2 ${isVerifying ? 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed' : 'bg-gray-900 text-white hover:bg-black shadow-lg hover:-translate-y-0.5'}`}
                                    >
                                        {isVerifying ? 'Verifying Identity...' : 'Capture & Verify Portrait'}
                                    </button>
                                )}

                                <button
                                    onClick={() => setStep(4)}
                                    className="w-full py-3 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-wider"
                                >
                                    Developer: Bypass Step
                                </button>
                            </div>
                        </div>
                    )}

                    {/* OTR FLOW: Step 4 (Finish) */}
                    {isOTR && step === 4 && (
                        <div className="text-center py-8 animate-fade-in-up">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(52,211,153,0.4)] relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
                                <Check className="w-10 h-10 text-white" strokeWidth={3.5} />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Account Live!</h2>
                            <p className="text-gray-500 text-base max-w-xs mx-auto font-medium mb-8">
                                Identity verified successfully. Your global reference ID has been generated securely.
                            </p>

                            <div className="bg-gray-100/80 p-6 rounded-3xl border border-gray-200/60 inline-block mb-10 shadow-inner">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Official OTR ID</p>
                                <p className="font-mono font-bold text-3xl text-blue-600 tracking-tight selection:bg-blue-200 selection:text-blue-900">
                                    OTR-{Math.floor(Math.random() * 10000000)}
                                </p>
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/login"
                                    className="w-full inline-block bg-gray-900 text-white rounded-2xl py-4 font-bold tracking-wide hover:bg-black hover:shadow-xl transition-all shadow-md text-sm"
                                >
                                    Proceed to Login Dashboard
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Global Animation Styles placed here securely */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    @keyframes scan {
                        0% { top: 5%; opacity: 0; }
                        10% { opacity: 1; }
                        90% { opacity: 1; }
                        100% { top: 95%; opacity: 0; }
                    }
                `}} />
            </div>
            <CampusAI />
        </div>
    );
};

export default Register;
