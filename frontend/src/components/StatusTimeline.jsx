import React from 'react';
import { FileText, RefreshCw, CheckCircle, Clock, XCircle } from 'lucide-react';

const StatusTimeline = ({ currentStatus }) => {
    // Standardizing status to 3 major steps for the progress flow
    const steps = [
        { id: 'Applied', label: 'Applied', icon: FileText },
        { id: 'Under Review', label: 'Under Review', icon: Clock },
        { id: 'Result', label: 'Result', icon: CheckCircle }
    ];

    const getStatusIndex = (status) => {
        if (['Submitted', 'Resubmitted'].includes(status)) return 0;
        if (['Under Review', 'Under Verification', 'Query Raised'].includes(status)) return 1;
        if (['Approved', 'Rejected'].includes(status)) return 2;
        return 0;
    };

    const currentIndex = getStatusIndex(currentStatus);
    const isRejected = currentStatus === 'Rejected';

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
            <h2 className="text-xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                <Clock className="text-indigo-600" size={24} />
                Application Progress
            </h2>

            <div className="flex justify-between items-center relative px-2">
                {/* Background Connector Bar */}
                <div className="absolute top-[20px] left-0 w-full h-[2px] bg-gray-100 -z-0" />

                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isActive = index === currentIndex;
                    const isFinalStep = index === 2;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-24">
                            {/* Icon Circle */}
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500
                                ${isFinalStep && isRejected
                                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                                    : (isCompleted || isActive)
                                        ? 'bg-green-500 border-green-500 text-white shadow-md'
                                        : 'bg-white border-gray-200 text-gray-300'}
                            `}>
                                {isFinalStep && isRejected ? <XCircle size={20} /> : <step.icon size={20} />}
                            </div>

                            {/* Label */}
                            <span className={`
                                mt-3 text-xs font-bold transition-colors duration-300 text-center
                                ${isActive ? 'text-indigo-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}
                            `}>
                                {isFinalStep && isRejected ? 'Rejected' : (isFinalStep && currentStatus === 'Approved' ? 'Approved' : step.label)}
                            </span>

                            {/* Pulse for active status */}
                            {isActive && !isRejected && (
                                <div className="absolute top-0 w-10 h-10 rounded-full border-4 border-green-500 animate-ping opacity-25" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Status Narrative */}
            <div className="mt-8 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                    {currentStatus === 'Submitted' && "Applied: Your application has been received and is waiting for initial verification."}
                    {currentStatus === 'Resubmitted' && "Re-Applied: Your updated application has been received and will be re-verified shortly."}
                    {currentStatus === 'Under Review' && "Under Review: Our senior verification officers are currently reviewing your documents."}
                    {currentStatus === 'Under Verification' && "Checking: Our verification officers are currently reviewing your documents."}
                    {currentStatus === 'Query Raised' && "Action Required: Please check the queries below and provide the requested information."}
                    {currentStatus === 'Approved' && "Congratulations! Your scholarship application has been approved and funds are available."}
                    {currentStatus === 'Rejected' && "We regret to inform you that your application was unsuccessful. Please check the remarks for details."}
                </p>
            </div>
        </div>
    );
};

export default StatusTimeline;
