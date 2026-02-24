import { useState, useRef, useEffect } from 'react';

const OtpInput = ({ length = 6, onComplete }) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        // Allow only one digit
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Submit trigger
        const combinedOtp = newOtp.join('');
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Move to next input if current field is filled
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // Optional: ensure user types in order?
        // if (index > 0 && !otp[index - 1]) {
        //     inputRefs.current[otp.indexOf('')].focus();
        // }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if empty
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text');
        if (!/^\d+$/.test(data)) return; // Only numbers

        const pasteData = data.split('').slice(0, length);
        const newOtp = [...otp];

        pasteData.forEach((val, i) => {
            newOtp[i] = val;
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = val; // Direct DOM update for speed
            }
        });

        setOtp(newOtp);

        if (newOtp.join('').length === length) {
            onComplete(newOtp.join(''));
        }

        // Focus the last filled or next empty field
        const nextIndex = Math.min(pasteData.length, length - 1);
        if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex].focus();
        }
    };

    return (
        <div className="flex gap-2">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(index, e)}
                    onClick={() => handleClick(index)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined} // Attach paste to first input or container
                    className="w-10 h-10 border border-gray-300 rounded text-center text-xl font-bold focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                    maxLength={1}
                />
            ))}
        </div>
    );
};

export default OtpInput;
