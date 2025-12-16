import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { toast } from 'sonner';
import { Building2, Mail, Phone, MapPin, FileText, Shield, Calendar, Edit2, Save, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getOrgTypeLabel, getOrgTypeBadgeColor } from './orgUtils';

const InfoRow = ({ icon: Icon, label, value, isEditing, name, onChange, type = "text" }) => (
    <div className="flex items-start gap-4 py-4 border-b border-gray-100">
        <div className="p-2 bg-gray-50 rounded-lg">
            <Icon className="text-gray-600" size={20} />
        </div>
        <div className="flex-1">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
            ) : (
                <p className="text-gray-800 font-medium">{value || 'Not provided'}</p>
            )}
        </div>
    </div>
);

const VerificationBadge = ({ status }) => {
    const config = {
        APPROVED: {
            color: 'bg-green-100 text-green-700 border-green-200',
            icon: CheckCircle,
            label: 'Verified'
        },
        PENDING: {
            color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            icon: Clock,
            label: 'Pending Verification'
        },
        REJECTED: {
            color: 'bg-red-100 text-red-700 border-red-200',
            icon: AlertCircle,
            label: 'Verification Rejected'
        }
    };

    const { color, icon: Icon, label } = config[status] || config.PENDING;

    return (
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${color}`}>
            <Icon size={18} />
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
};

const ProfileTab = () => {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        organizationName: '',
        Name: '',
        Email: '',
        PhoneNumber: '',
        City: '',
        licenseNo: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                organizationName: user.organizationName || '',
                Name: user.Name || '',
                Email: user.Email || '',
                PhoneNumber: user.PhoneNumber || '',
                City: user.City || '',
                licenseNo: user.licenseNo || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Call backend API to update profile
            const res = await client.put('/api/profile', formData);

            // Update auth context with new user data
            setUser({ ...user, ...formData });

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form to user data
        setFormData({
            organizationName: user.organizationName || '',
            Name: user.Name || '',
            Email: user.Email || '',
            PhoneNumber: user.PhoneNumber || '',
            City: user.City || '',
            licenseNo: user.licenseNo || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Organization Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your organization information and settings</p>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <Edit2 size={18} />
                            Edit Profile
                        </button>
                    ) : (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Verification Status */}
                <div className="flex items-center gap-4">
                    <VerificationBadge status={user?.verificationStatus} />
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getOrgTypeBadgeColor(user?.organizationType)}`}>
                        {getOrgTypeLabel(user?.organizationType)}
                    </div>
                </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Organization Information</h2>

                <div className="space-y-0">
                    <InfoRow
                        icon={Building2}
                        label="Organization Name"
                        value={formData.organizationName}
                        isEditing={isEditing}
                        name="organizationName"
                        onChange={handleChange}
                    />

                    <InfoRow
                        icon={Building2}
                        label="Contact Person Name"
                        value={formData.Name}
                        isEditing={isEditing}
                        name="Name"
                        onChange={handleChange}
                    />

                    <InfoRow
                        icon={Mail}
                        label="Email Address"
                        value={formData.Email}
                        isEditing={isEditing}
                        name="Email"
                        onChange={handleChange}
                        type="email"
                    />

                    <InfoRow
                        icon={Phone}
                        label="Phone Number"
                        value={formData.PhoneNumber}
                        isEditing={isEditing}
                        name="PhoneNumber"
                        onChange={handleChange}
                        type="tel"
                    />

                    <InfoRow
                        icon={MapPin}
                        label="City"
                        value={formData.City}
                        isEditing={isEditing}
                        name="City"
                        onChange={handleChange}
                    />

                    <InfoRow
                        icon={FileText}
                        label="License Number"
                        value={formData.licenseNo}
                        isEditing={isEditing}
                        name="licenseNo"
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Account Details (Read-only) */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Account Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="text-gray-600" size={18} />
                            <p className="text-sm text-gray-500">Account Status</p>
                        </div>
                        <p className="text-gray-800 font-medium">{user?.accountStatus || 'ACTIVE'}</p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar className="text-gray-600" size={18} />
                            <p className="text-sm text-gray-500">Member Since</p>
                        </div>
                        <p className="text-gray-800 font-medium">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            }) : 'N/A'}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="text-gray-600" size={18} />
                            <p className="text-sm text-gray-500">Organization Type</p>
                        </div>
                        <p className="text-gray-800 font-medium">{getOrgTypeLabel(user?.organizationType)}</p>
                        <p className="text-xs text-gray-500 mt-1">Contact admin to change organization type</p>
                    </div>

                    {user?.verifiedAt && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="text-gray-600" size={18} />
                                <p className="text-sm text-gray-500">Verified On</p>
                            </div>
                            <p className="text-gray-800 font-medium">
                                {new Date(user.verifiedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Help Text */}
            {user?.verificationStatus === 'PENDING' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <Clock className="text-yellow-600 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-semibold text-yellow-800 mb-1">Verification Pending</h3>
                            <p className="text-sm text-yellow-700">
                                Your organization is currently under verification. You can still use the platform, but some features may be restricted until verification is complete.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {user?.verificationStatus === 'REJECTED' && user?.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 mt-0.5" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-800 mb-1">Verification Rejected</h3>
                            <p className="text-sm text-red-700 mb-2">
                                Your organization verification was rejected. Please contact support for assistance.
                            </p>
                            <p className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
                                <strong>Reason:</strong> {user.rejectionReason}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTab;
