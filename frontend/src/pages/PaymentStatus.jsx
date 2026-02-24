import { useState } from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';
import OtpInput from '../components/OtpInput';

const PaymentStatus = () => {
    const [accountNo, setAccountNo] = useState('');
    const [confirmAccountNo, setConfirmAccountNo] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [searchResult, setSearchResult] = useState(null);

    const [captcha, setCaptcha] = useState('');

    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptcha(result);
    };

    useState(() => {
        generateCaptcha();
    }, []);

    const handleSendOtp = () => {
        if (!accountNo || !confirmAccountNo || !verificationCode) {
            alert("Please fill all required fields");
            return;
        }
        if (accountNo !== confirmAccountNo) {
            alert("Account Numbers do not match");
            return;
        }
        if (verificationCode !== captcha) {
            alert("Invalid Verification Code");
            generateCaptcha();
            setVerificationCode('');
            return;
        }
        setIsOtpSent(true);
        alert("OTP Sent to registered mobile number linked with account.");
    };

    const handleSearch = () => {
        if (!otp) {
            alert("Please enter OTP");
            return;
        }
        // Mock Result
        setSearchResult([
            {
                scheme: "POST MATRIC SCHOLARSHIP SCHEMES MINORITIES CS",
                agency: "MINISTRY OF MINORITY AFFAIRS",
                utr: "SBIN521268492812",
                ac_no: "XXXXXX" + accountNo.slice(-4),
                name: "MOHAMMAD ADIL",
                amount: "12,500.00",
                status: "Success",
                creditDate: "12/03/2025"
            },
            {
                scheme: "POST MATRIC SCHOLARSHIP SCHEMES MINORITIES CS",
                agency: "MINISTRY OF MINORITY AFFAIRS",
                utr: "SBIN821212349281",
                ac_no: "XXXXXX" + accountNo.slice(-4),
                name: "MOHAMMAD ADIL",
                amount: "5,400.00",
                status: "Success",
                creditDate: "10/02/2024"
            }
        ]);
    };

    const handleReset = () => {
        setAccountNo('');
        setConfirmAccountNo('');
        setVerificationCode('');
        setOtp('');
        setIsOtpSent(false);
        setSearchResult(null);
        generateCaptcha();
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <main className="container mx-auto px-4 py-8 flex-1">
                <div className="bg-white border-b p-4 mb-6 flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-800">Payment Status</h2>
                </div>

                <div className="bg-[#FFF0F5] border border-pink-100 p-2 mb-6 rounded">
                    <h2 className="text-[#D63384] font-bold text-sm">Payment by Account Number</h2>
                </div>

                <div className="max-w-4xl mx-auto bg-white p-8 border rounded-lg shadow-sm">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-gray-700">Bank:</label>
                            <div className="md:col-span-2 relative">
                                <input
                                    type="text"
                                    list="bank-names"
                                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    placeholder="Enter First Few Characters Of Bank Name"
                                />
                                <datalist id="bank-names">
                                    <option value="State Bank of India" />
                                    <option value="HDFC Bank" />
                                    <option value="ICICI Bank" />
                                    <option value="Punjab National Bank" />
                                    <option value="Bank of Baroda" />
                                    <option value="Canara Bank" />
                                    <option value="Union Bank of India" />
                                    <option value="Bank of India" />
                                    <option value="Indian Bank" />
                                    <option value="Central Bank of India" />
                                </datalist>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-gray-700">Enter Account Number:</label>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={accountNo}
                                    onChange={(e) => setAccountNo(e.target.value)}
                                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-gray-700">Enter Confirm Account Number:</label>
                            <div className="md:col-span-2">
                                <input
                                    type="text"
                                    value={confirmAccountNo}
                                    onChange={(e) => setConfirmAccountNo(e.target.value)}
                                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <label className="text-sm font-bold text-gray-700">Word Verification:</label>
                            <div className="md:col-span-2 flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    <div className="border p-2 bg-white tracking-[0.5em] font-mono text-xl filter blur-[0.5px] select-none w-32 text-center relative overflow-hidden text-gray-600 font-bold">
                                        <div className="absolute inset-0 bg-gray-100 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}></div>
                                        {captcha}
                                    </div>
                                    <button type="button" onClick={generateCaptcha} className="text-gray-500 hover:text-blue-600 transition-colors"><RefreshCw className="w-5 h-5" /></button>
                                </div>
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    placeholder="Enter the code shown above"
                                />
                            </div>
                        </div>

                        {isOtpSent && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center animate-fade-in">
                                <label className="text-sm font-bold text-gray-700">Enter OTP:</label>
                                <div className="md:col-span-2">
                                    <OtpInput length={6} onComplete={setOtp} />
                                    <p className="text-xs text-green-600 mt-1">OTP sent to registered mobile number.</p>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4 pt-4">
                            {!isOtpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    className="bg-[#003366] text-white font-bold px-6 py-2 rounded text-sm hover:bg-[#002244]"
                                >
                                    Send OTP on Registered Mobile No.
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="bg-[#003366] text-white font-bold px-6 py-2 rounded text-sm hover:bg-[#002244]"
                                >
                                    Verify OTP
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleReset}
                                className="bg-[#cc3333] text-white font-bold px-6 py-2 rounded text-sm hover:bg-[#aa2222]"
                            >
                                Reset
                            </button>
                        </div>
                    </form>

                    {/* Result Section */}
                    {searchResult && (
                        <div className="mt-8 border-t pt-8">
                            <h3 className="text-lg font-bold text-[#003366] mb-4">Payment Details</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left border-collapse border border-gray-300">
                                    <thead className="bg-[#003366] text-white">
                                        <tr>
                                            <th className="border border-gray-300 p-2">Scheme Name</th>
                                            <th className="border border-gray-300 p-2">Agency Name</th>
                                            <th className="border border-gray-300 p-2">UTR No.</th>
                                            <th className="border border-gray-300 p-2">Ac/No</th>
                                            <th className="border border-gray-300 p-2">Name</th>
                                            <th className="border border-gray-300 p-2">Amount</th>
                                            <th className="border border-gray-300 p-2">Status</th>
                                            <th className="border border-gray-300 p-2">Credit Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchResult.map((row, idx) => (
                                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="border border-gray-300 p-2">{row.scheme}</td>
                                                <td className="border border-gray-300 p-2">{row.agency}</td>
                                                <td className="border border-gray-300 p-2">{row.utr}</td>
                                                <td className="border border-gray-300 p-2">{row.ac_no}</td>
                                                <td className="border border-gray-300 p-2">{row.name}</td>
                                                <td className="border border-gray-300 p-2 font-bold">{row.amount}</td>
                                                <td className="border border-gray-300 p-2 text-green-600 font-bold">{row.status}</td>
                                                <td className="border border-gray-300 p-2">{row.creditDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PaymentStatus;
