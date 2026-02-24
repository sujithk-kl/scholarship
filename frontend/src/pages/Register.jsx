import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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

    // If it's a non-student role, we treat it as a "Portal Registration" instead of OTR
    // OTR is strictly for Students.
    // User requested OTR flow for all roles.
    const isOTR = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await register(formData.name, formData.email, formData.password, formData.role, formData.mobile);
            if (isOTR) {
                setStep(3); // Move to eKYC step on success
            } else {
                // Direct redirect for admin/verifier
                alert('Registration Successful! Please Login.');
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
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-sm">
            {/* Header matching NSP */}
            <header className="bg-white px-6 py-3 shadow-sm flex justify-between items-center border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">SS</div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-blue-900 tracking-tight">Smart Scholarship</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Management System</span>
                    </div>
                </div>
                <div className="flex text-xs text-gray-500 gap-4">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <span>Helpdesk 🎧</span>
                </div>
            </header>

            <div className="container mx-auto p-4 md:p-8 flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        {isOTR ? 'Student Registration (OTR)' : `${formData.role} Registration`}
                    </h1>
                    <div className="text-sm">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                    </div>
                </div>

                {/* Stepper - ONLY for OTR (Students) */}
                {isOTR && (
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center w-full max-w-3xl">
                            {['Guidelines', 'Register Mobile No.', 'eKYC', 'Finish'].map((label, index) => {
                                const stepNum = index + 1;
                                const isActive = step >= stepNum;
                                const isCurrent = step === stepNum;

                                return (
                                    <div key={index} className="flex-1 flex items-center relative">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${isActive ? 'bg-gray-400 text-white border-gray-400' : 'bg-white text-gray-400 border-gray-300'} z-10 transition-colors`}>
                                            {isActive ? '✓' : stepNum}
                                        </div>
                                        <span className={`ml-2 text-xs font-semibold ${isCurrent ? 'text-black' : 'text-gray-500'}`}>{stepNum}. {label}</span>
                                        {index < 3 && (
                                            <div className={`absolute left-0 top-1/2 w-full h-0.5 -z-0 transform translate-x-4 ${step > stepNum ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm border p-6">

                    {/* NON-OTR FLOW (Admin/Verifier) */}
                    {/* NON-OTR FLOW (Admin/Verifier) */}
                    {!isOTR && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Official Registration</h2>
                            {error && <div className="bg-red-50 text-red-700 p-3 mb-6 rounded-lg text-sm">{error}</div>}
                            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                                <div>
                                    <label className="block mb-1 text-xs font-semibold text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Enter Full Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-semibold text-gray-700">Email Address (Used for Login)</label>
                                    <input
                                        type="email"
                                        className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-semibold text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-semibold text-gray-700">Mobile Number</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Enter 10-digit Mobile No."
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-semibold text-gray-700">Role</label>
                                    {/* If explicit role from URL, make it read-only or hidden to prevent confusion */}
                                    {queryRole ? (
                                        <input
                                            type="text"
                                            value={formData.role}
                                            readOnly
                                            className="w-full border p-2 rounded bg-gray-100 text-gray-500 outline-none cursor-not-allowed"
                                        />
                                    ) : (
                                        <select
                                            className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="Student">Student</option>
                                            <option value="Verifier">Verifier</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    )}
                                </div>

                                <div className="pt-4 flex justify-between">
                                    {isOTR && <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-800 text-xs">Back</button>}

                                    <div className={`flex gap-2 ${!isOTR ? 'w-full' : ''}`}>
                                        {isOTR && <button type="button" onClick={nextStep} className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-xs hover:bg-gray-300">Skip to eKYC (Demo)</button>}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-xs disabled:opacity-50 ${!isOTR ? 'w-full' : ''}`}
                                        >
                                            {isLoading ? 'Registering...' : (isOTR ? 'Register & Verify eKYC' : 'Create Account')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* OTR FLOW (Student) */}
                    {isOTR && (
                        <>
                            {/* Step 1: Guidelines */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">1. One Time Registration (OTR) Guidelines</h2>
                                    <div className="text-sm text-gray-700 space-y-4">
                                        <p><strong>1. Mandatory Requirement:</strong> One Time Registration (OTR) is mandatory.</p>
                                        <p><strong>2. Essential Requirement for OTR:</strong> Active mobile number is mandatory.</p>
                                        <p><strong>3. No payment of fee</strong> is required.</p>
                                        {/* Simplified text for brevity as full text is in previous artifact if needed */}
                                        <div>
                                            <strong>4. Steps for Registration:</strong>
                                            <ul className="list-[upper-roman] pl-5 mt-2 space-y-1 text-gray-600 text-xs">
                                                <li>Once allotted an OTR, student can apply for scholarship later.</li>
                                                <li>Upon successful registration, a reference number will be sent.</li>
                                                <li>Download NSP OTR app for Face-Authentication.</li>
                                            </ul>
                                        </div>

                                        <div className="mt-6 flex items-center gap-2">
                                            <input type="checkbox" id="agree" className="w-4 h-4 text-blue-600" />
                                            <label htmlFor="agree" className="text-xs text-gray-600">I have read and understood the guidelines.</label>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button onClick={nextStep} className="bg-gray-700 text-white px-6 py-2 rounded hover:bg-gray-800 text-xs">Next</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Register Mobile No */}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">2. Register Mobile No.</h2>
                                    {error && <div className="bg-red-50 text-red-700 p-3 mb-6 rounded-lg text-sm">{error}</div>}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block mb-1 text-xs font-semibold text-gray-700">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="Enter Full Name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-semibold text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="you@example.com"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-semibold text-gray-700">Password</label>
                                            <input
                                                type="password"
                                                className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block mb-1 text-xs font-semibold text-gray-700">Mobile Number</label>
                                            <input
                                                type="text"
                                                className="w-full border p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                                                placeholder="Enter 10-digit Mobile No."
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="pt-4 flex justify-between">
                                            <button type="button" onClick={prevStep} className="text-gray-600 hover:text-gray-800 text-xs">Back</button>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-xs disabled:opacity-50"
                                            >
                                                {isLoading ? 'Verifying...' : 'Register & Proceed'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Step 3: eKYC Face Authentication */}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">3. eKYC Face Authentication</h2>
                                    <div className="flex flex-col items-center justify-center py-6">

                                        {/* Face Auth Section */}
                                        <div className="w-full max-w-md flex flex-col items-center p-6 border rounded-lg bg-gray-50 shadow-sm">
                                            <h3 className="font-bold text-gray-700 mb-2">eKYC Face Verification</h3>
                                            <p className="text-xs text-gray-500 mb-6 text-center">Use your camera for verification</p>

                                            {!isCameraActive ? (
                                                <div className="w-56 h-56 bg-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-inner">
                                                    <span className="text-5xl">📸</span>
                                                </div>
                                            ) : (
                                                <div className="relative w-56 h-56 bg-black rounded-lg overflow-hidden mb-6 border-2 border-blue-500 shadow-md">
                                                    <video
                                                        id="webcam"
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-full object-cover transform scale-x-[-1]"
                                                        onLoadedMetadata={(e) => e.target.play()}
                                                    />
                                                    {/* Scanning Overlay */}
                                                    <div className="absolute inset-0 bg-green-500/20 animate-pulse z-10"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                                        <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Scanning...</span>
                                                    </div>
                                                </div>
                                            )}

                                            {!isCameraActive ? (
                                                <button
                                                    onClick={() => startCamera()}
                                                    className="bg-blue-600 text-white px-8 py-2 rounded text-sm hover:bg-blue-700 transition-colors shadow-md w-full"
                                                >
                                                    Start Camera
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={verifyFace} // Function to be defined
                                                    disabled={isVerifying}
                                                    className={`px-8 py-2 rounded text-sm transition-colors shadow-md w-full ${isVerifying ? 'bg-green-600 text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
                                                >
                                                    {isVerifying ? 'Verifying...' : 'Capture & Verify'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-between border-t pt-4">
                                        <button onClick={prevStep} className="text-gray-600 hover:text-gray-800 text-xs">Back</button>
                                        <button onClick={() => setStep(4)} className="text-blue-500 text-xs hover:underline">Skip (Demo Mode)</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Finish */}
                            {step === 4 && (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center text-green-600 text-2xl mb-4">✓</div>
                                    <h2 className="text-xl font-bold text-gray-800">Registration Successful!</h2>
                                    <p className="text-gray-600 mt-2">Your OTR Reference Number has been generated.</p>
                                    <div className="mt-4 bg-gray-50 p-3 rounded inline-block">
                                        <span className="font-mono font-bold text-lg text-gray-700">OTR-{Math.floor(Math.random() * 10000000)}</span>
                                    </div>
                                    <div className="mt-8">
                                        <Link to="/login" className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 text-sm">Proceed to Login</Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
