import React, { useState } from 'react';
import { Edit2, MapPin, CheckCircle, Clock } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

const WelcomeCard = ({ user, onRefresh }) => {
    const { Name, City, bloodGroup, Bloodgroup, eligible, lastDonationDate } = user || {};
    const displayGroup = bloodGroup || Bloodgroup || "N/A";
    const displayName = Name ? Name.split(' ')[0] : "Donor"; // First name only
    const location = City || "Location Unknown";

    // Check eligibility logic if not passed directly (though api should send it)
    const isEligible = eligible !== false; // Default true if undefined

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full -mr-8 -mt-8 opacity-50 pointer-events-none"></div>

            <div className="flex items-start gap-4 z-10">
                <div className="w-16 h-16 rounded-full bg-red-100 shadow-black flex items-center justify-center text-red-600 font-bold text-2xl border-2 border-white shadow-md">
                    {displayGroup}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome back, {displayName}!</h2>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{location}</span>
                        </div>
                    </div>
                    <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isEligible
                        ? "bg-teal-50 text-teal-700 border-teal-100"
                        : "bg-yellow-50 text-yellow-700 border-yellow-100"
                        }`}>
                        <CheckCircle size={12} />
                        {isEligible ? "Eligible to donate" : "Not eligible yet"}
                    </div>
                </div>
            </div>

            <button
                onClick={() => setShowModal(true)}
                disabled={user?.profileUpdatePending}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Edit2 size={14} />
                {user?.profileUpdatePending ? "Review Pending" : "Edit details"}
            </button>

            {showModal && <EditProfileModal user={user} onClose={() => setShowModal(false)} onRefresh={onRefresh} />}
        </div>
    );
};

export default WelcomeCard;
