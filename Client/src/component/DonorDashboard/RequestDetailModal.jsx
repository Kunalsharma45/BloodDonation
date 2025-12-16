import React, { useState } from 'react';
import {
    X,
    MapPin,
    Phone,
    Clock,
    Droplet,
    Heart,
    AlertCircle,
    Building2,
    Calendar,
    User,
    Info
} from 'lucide-react';
import {
    getUrgencyColor,
    getStatusColor,
    formatDistance,
    calculateResponseTime,
    getComponentLabel,
    REQUEST_URGENCY
} from '../../constants/requestConstants';
import { toast } from 'sonner';

const RequestDetailModal = ({ request, isOpen, onClose, onExpressInterest, isInterested }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !request) return null;

    const urgencyColor = getUrgencyColor(request.urgency);
    const statusColor = getStatusColor(request.status);

    const handleExpressInterest = async () => {
        setIsSubmitting(true);
        try {
            await onExpressInterest(request._id);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white shadow-md">
                                <Droplet className="w-6 h-6 fill-current" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Blood Request Details</h2>
                                <p className="text-sm text-gray-500">Request ID: #{request._id?.slice(-8)}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Status & Urgency */}
                        <div className="flex gap-3 mb-6">
                            <div className={`px-4 py-2 rounded-lg ${statusColor.bg} ${statusColor.text} font-semibold text-sm flex items-center gap-2`}>
                                <div className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
                                {request.status}
                            </div>
                            <div className={`px-4 py-2 rounded-lg ${urgencyColor.bg} ${urgencyColor.text} font-semibold text-sm flex items-center gap-2`}>
                                {request.urgency === REQUEST_URGENCY.CRITICAL && <AlertCircle className="w-4 h-4" />}
                                {request.urgency} Priority
                            </div>
                        </div>

                        {/* Blood Requirements */}
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 mb-6 border border-red-200">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-red-600" />
                                Blood Requirements
                            </h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                                    <p className="text-2xl font-bold text-red-600">{request.bloodGroup}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Units Needed</p>
                                    <p className="text-2xl font-bold text-gray-900">{request.unitsNeeded}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Component</p>
                                    <p className="text-lg font-bold text-gray-900">{getComponentLabel(request.component)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Information */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-blue-600" />
                                Hospital Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Hospital Name</p>
                                        <p className="font-semibold text-gray-900">{request.hospitalName || request.organizationName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-semibold text-gray-900">
                                            {request.location?.address || `${request.location?.city}, ${request.location?.state}`}
                                        </p>
                                        <p className="text-sm text-green-600 mt-1">
                                            {formatDistance(request.distance)} away from you
                                        </p>
                                    </div>
                                </div>
                                {request.contactPerson && (
                                    <div className="flex items-start gap-3">
                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Person</p>
                                            <p className="font-semibold text-gray-900">{request.contactPerson}</p>
                                        </div>
                                    </div>
                                )}
                                {request.contactPhone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Contact Number</p>
                                            <a href={`tel:${request.contactPhone}`} className="font-semibold text-blue-600 hover:underline">
                                                {request.contactPhone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Case Details */}
                        {request.caseDetails && (
                            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-amber-600" />
                                    Case Details
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{request.caseDetails}</p>
                            </div>
                        )}

                        {/* Time Information */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <p className="text-sm text-gray-500">Posted</p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                    {calculateResponseTime(request.createdAt)} ago
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(request.createdAt).toLocaleString()}
                                </p>
                            </div>
                            {request.requiredBy && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm text-gray-500">Required By</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        {new Date(request.requiredBy).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(request.requiredBy).toLocaleTimeString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Interested Donors */}
                        {request.interestedDonorsCount > 0 && (
                            <div className="bg-green-50 rounded-lg border border-green-200 p-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-green-600 fill-current" />
                                    <p className="text-sm font-semibold text-green-800">
                                        {request.interestedDonorsCount} donor{request.interestedDonorsCount > 1 ? 's' : ''} have already expressed interest
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Eligibility Warning */}
                        {!request.isEligible && (
                            <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-800 mb-1">Eligibility Notice</p>
                                        <p className="text-sm text-yellow-700">
                                            You may not be eligible to donate at this time. Please check your last donation date and ensure you meet all eligibility criteria.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        {!isInterested ? (
                            <button
                                onClick={handleExpressInterest}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Heart className="w-5 h-5" />
                                {isSubmitting ? 'Processing...' : 'I Can Donate'}
                            </button>
                        ) : (
                            <div className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2">
                                <Heart className="w-5 h-5 fill-current" />
                                Interest Expressed
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailModal;
