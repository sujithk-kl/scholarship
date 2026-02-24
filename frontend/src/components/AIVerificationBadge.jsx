import React from 'react';
import { ShieldCheck, ShieldAlert, ShieldX, Cpu } from 'lucide-react';

const AIVerificationBadge = ({ score, showLabel = true }) => {
    // Score thresholds:
    // 0-30: Verified (Green)
    // 31-70: Suspicious (Yellow)
    // 71-100: Rejected/Fraud (Red)

    const getStatus = () => {
        if (score === null || score === undefined) return { label: 'Not Run', color: 'bg-gray-100 text-gray-500', icon: Cpu };
        if (score <= 30) return { label: 'Verified', color: 'bg-green-100 text-green-700 border-green-200', icon: ShieldCheck, textColor: 'text-green-700' };
        if (score <= 70) return { label: 'Suspicious', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: ShieldAlert, textColor: 'text-yellow-700' };
        return { label: 'Fraud Risk', color: 'bg-red-100 text-red-700 border-red-200', icon: ShieldX, textColor: 'text-red-700' };
    };

    const status = getStatus();
    const Icon = status.icon;

    if (score === null || score === undefined) {
        return (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.color}`}>
                <Icon size={14} />
                {showLabel && <span>AI Check: {status.label}</span>}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-end">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 font-black text-sm transition-all shadow-sm ${status.color}`}>
                <Icon size={18} className="animate-pulse" />
                <div className="flex flex-col">
                    <span className="leading-none text-[10px] uppercase opacity-70">AI Trust Score</span>
                    <span className="leading-tight">{score}% - {status.label}</span>
                </div>
            </div>
        </div>
    );
};

export default AIVerificationBadge;
