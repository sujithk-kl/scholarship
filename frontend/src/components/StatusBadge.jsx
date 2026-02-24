const StatusBadge = ({ status }) => {
    let colorClass = 'bg-gray-500';

    switch (status) {
        case 'Submitted':
        case 'Resubmitted':
            colorClass = 'bg-blue-500';
            break;
        case 'Under Verification':
            colorClass = 'bg-yellow-500';
            break;
        case 'Approved':
            colorClass = 'bg-green-500';
            break;
        case 'Rejected':
            colorClass = 'bg-red-500';
            break;
        case 'Query Raised':
            colorClass = 'bg-orange-500';
            break;
        default:
            colorClass = 'bg-gray-500';
    }

    return (
        <span className={`px-3 py-1 text-white text-sm rounded-full ${colorClass}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
