import React, { useState } from 'react';
import {
    X,
    Droplet,
    MapPin,
    Phone,
    User,
    AlertCircle,
    Calendar,
    FileText,
    Plus
} from 'lucide-react';
import { toast } from 'sonner';
import requestApi from '../../api/requestApi';
import {
    REQUEST_URGENCY,
    BLOOD_GROUPS,
    BLOOD_COMPONENTS,
    getComponentLabel
} from '../../constants/requestConstants';

const CreateRequestModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        bloodGroup: '',
        component: BLOOD_COMPONENTS.WHOLE_BLOOD,
        unitsNeeded: 1,
        urgency: REQUEST_URGENCY.MEDIUM,
        requiredBy: '',
        contactPerson: '',
        contactPhone: '',
        caseDetails: '',
        patientAge: '',
        patientGender: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
        if (!formData.unitsNeeded || formData.unitsNeeded < 1) {
            newErrors.unitsNeeded = 'Units needed must be at least 1';
        }
        if (!formData.urgency) newErrors.urgency = 'Urgency level is required';
        if (!formData.contactPerson) newErrors.contactPerson = 'Contact person is required';
        if (!formData.contactPhone) newErrors.contactPhone = 'Contact phone is required';
        if (!formData.caseDetails || formData.caseDetails.length < 10) {
            newErrors.caseDetails = 'Please provide detailed case information (min 10 characters)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await requestApi.createRequest({
                ...formData,
                unitsNeeded: parseInt(formData.unitsNeeded),
                patientAge: formData.patientAge ? parseInt(formData.patientAge) : undefined,
                requiredBy: formData.requiredBy || undefined
            });

            toast.success('Blood request created successfully!');
            onSuccess(response);
            handleClose();
        } catch (error) {
            console.error('Failed to create request:', error);
            toast.error(error.response?.data?.message || 'Failed to create request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            bloodGroup: '',
            component: BLOOD_COMPONENTS.WHOLE_BLOOD,
            unitsNeeded: 1,
            urgency: REQUEST_URGENCY.MEDIUM,
            requiredBy: '',
            contactPerson: '',
            contactPhone: '',
            caseDetails: '',
            patientAge: '',
            patientGender: ''
        });
        setErrors({});
        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <Plus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Create Blood Request</h2>
                                <p className="text-sm text-red-100">Fill in the details to request blood</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        {/* Blood Requirements Section */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Droplet className="w-5 h-5 text-red-600" />
                                Blood Requirements
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Blood Group <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={formData.bloodGroup}
                                        onChange={(e) => handleChange('bloodGroup', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select Blood Group</option>
                                        {BLOOD_GROUPS.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                    {errors.bloodGroup && (
                                        <p className="mt-1 text-sm text-red-600">{errors.bloodGroup}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Component Type
                                    </label>
                                    <select
                                        value={formData.component}
                                        onChange={(e) => handleChange('component', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        {Object.entries(BLOOD_COMPONENTS).map(([key, value]) => (
                                            <option key={key} value={value}>{getComponentLabel(value)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Units Needed <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={formData.unitsNeeded}
                                        onChange={(e) => handleChange('unitsNeeded', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.unitsNeeded ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.unitsNeeded && (
                                        <p className="mt-1 text-sm text-red-600">{errors.unitsNeeded}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Urgency & Timeline */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-600" />
                                Urgency & Timeline
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Urgency Level <span className="text-red-600">*</span>
                                    </label>
                                    <select
                                        value={formData.urgency}
                                        onChange={(e) => handleChange('urgency', e.target.value)}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.urgency ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        {Object.values(REQUEST_URGENCY).map(urgency => (
                                            <option key={urgency} value={urgency}>{urgency}</option>
                                        ))}
                                    </select>
                                    {errors.urgency && (
                                        <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Required By (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.requiredBy}
                                        onChange={(e) => handleChange('requiredBy', e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Phone className="w-5 h-5 text-blue-600" />
                                Contact Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Person <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactPerson}
                                        onChange={(e) => handleChange('contactPerson', e.target.value)}
                                        placeholder="Dr. John Doe"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.contactPerson && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Phone <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                                        placeholder="+91 9876543210"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.contactPhone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.contactPhone && (
                                        <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Patient Information */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-purple-600" />
                                Patient Information (Optional)
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Age
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="120"
                                        value={formData.patientAge}
                                        onChange={(e) => handleChange('patientAge', e.target.value)}
                                        placeholder="25"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Patient Gender
                                    </label>
                                    <select
                                        value={formData.patientGender}
                                        onChange={(e) => handleChange('patientGender', e.target.value)}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Case Details */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                Case Details
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Detailed Case Information <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    value={formData.caseDetails}
                                    onChange={(e) => handleChange('caseDetails', e.target.value)}
                                    placeholder="Please provide detailed information about the medical case, reason for blood requirement, patient condition, etc."
                                    rows={5}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.caseDetails ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                <div className="flex justify-between mt-1">
                                    {errors.caseDetails ? (
                                        <p className="text-sm text-red-600">{errors.caseDetails}</p>
                                    ) : (
                                        <p className="text-sm text-gray-500">Min 10 characters</p>
                                    )}
                                    <p className="text-sm text-gray-500">{formData.caseDetails.length} characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Note */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-blue-900 mb-1">Request Visibility</p>
                                    <p className="text-sm text-blue-700">
                                        Your request will be visible to compatible donors and blood banks in your area.
                                        You'll receive notifications when donors express interest or blood banks can fulfill your request.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer Actions */}
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-5 h-5" />
                                    Create Request
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateRequestModal;
