import React, { useState, useEffect } from 'react';
import { User, Save, MapPin, Phone, Droplet, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSkeleton from '../common/LoadingSkeleton';
import donorApi from '../../api/donorApi';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const data = await donorApi.getProfile();
            setUser(data);
        } catch (err) {
            console.error("Failed to load profile", err);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section, data) => {
        try {
            setSaving(true);
            // Send profile update request that requires admin approval
            const updateData = {
                Name: data.Name,
                City: data.City,
                PhoneNumber: data.PhoneNumber,
                bloodGroup: data.bloodGroup,
                Gender: data.Gender,
                DateOfBirth: data.DateOfBirth,
                State: data.State,
                Country: data.Country,
            };

            // Use requestProfileUpdate instead of updateProfile
            await donorApi.requestProfileUpdate(updateData);

            toast.success("Update request submitted! Waiting for admin approval.", {
                duration: 4000,
            });

            await fetchProfile(); // Refresh to show pending status
        } catch (err) {
            console.error("Update failed", err);
            toast.error(err.response?.data?.message || "Failed to submit update request");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <LoadingSkeleton width="w-48" height="h-8" />
                <div className="flex gap-4 border-b border-gray-200 pb-3">
                    <LoadingSkeleton width="w-32" height="h-10" />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i}><LoadingSkeleton width="w-24" height="h-4" className="mb-2" /><LoadingSkeleton height="h-12" /></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (!user) return <div className="p-6">User not found</div>;

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: User },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

            <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative
                                ${activeTab === tab.id
                                    ? 'text-red-600'
                                    : 'text-gray-500 hover:text-gray-700'}
                            `}
                        >
                            <Icon size={18} />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {activeTab === 'personal' && <PersonalTab user={user} onSave={handleSave} saving={saving} />}
            </div>
        </div>
    );
};

// Sub-components for Tabs

const PersonalTab = ({ user, onSave, saving }) => {
    const [formData, setFormData] = useState({
        Name: user.Name || '',
        PhoneNumber: user.PhoneNumber || '',
        bloodGroup: user.bloodGroup || '',
        City: user.City || '',
        Gender: user.Gender || '',
        DateOfBirth: user.DateOfBirth ? new Date(user.DateOfBirth).toISOString().split('T')[0] : '',
        State: user.State || '',
        Country: user.Country || 'India',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const hasChanges = () => {
        const dob = user.DateOfBirth ? new Date(user.DateOfBirth).toISOString().split('T')[0] : '';
        return (
            formData.Name !== (user.Name || '') ||
            formData.PhoneNumber !== (user.PhoneNumber || '') ||
            formData.bloodGroup !== (user.bloodGroup || '') ||
            formData.City !== (user.City || '') ||
            formData.Gender !== (user.Gender || '') ||
            formData.DateOfBirth !== dob ||
            formData.State !== (user.State || '') ||
            formData.Country !== (user.Country || 'India')
        );
    };

    return (
        <div className="space-y-6">
            {/* Info Alert */}
            <div className={`border rounded-lg p-4 flex items-start gap-3 ${user.profileUpdatePending
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                <div className={`mt-0.5 ${user.profileUpdatePending ? 'text-yellow-600' : 'text-blue-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-sm">
                    {user.profileUpdatePending ? (
                        <>
                            <p className="font-medium mb-1 text-yellow-800">⏳ Profile Update Pending</p>
                            <p className="text-yellow-700">Your profile update request is waiting for admin approval. You'll be notified once it's reviewed.</p>
                        </>
                    ) : (
                        <>
                            <p className="font-medium mb-1 text-blue-800">Profile Update Information</p>
                            <p className="text-blue-700">You can update your information here. Changes will require admin approval before being applied to your profile.</p>
                        </>
                    )}
                </div>
            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full Name" icon={User}>
                    <input
                        name="Name"
                        value={formData.Name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                        placeholder="Enter your full name"
                    />
                </Field>

                <Field label="Email Address" icon={User} hint="Read-only">
                    <input
                        value={user.Email}
                        disabled
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                </Field>

                <Field label="Phone Number" icon={Phone}>
                    <input
                        name="PhoneNumber"
                        value={formData.PhoneNumber}
                        onChange={handleChange}
                        type="tel"
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                        placeholder="Enter phone number"
                    />
                </Field>

                <Field label="Blood Group" icon={Droplet}>
                    <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                    >
                        <option value="">Select Blood Group</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                            <option key={bg} value={bg}>{bg}</option>
                        ))}
                    </select>
                </Field>

                <Field label="City" icon={MapPin}>
                    <input
                        name="City"
                        value={formData.City}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                        placeholder="Enter your city"
                    />
                </Field>

                <Field label="State" icon={MapPin}>
                    <input
                        name="State"
                        value={formData.State}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                        placeholder="Enter your state"
                    />
                </Field>

                <Field label="Country" icon={MapPin}>
                    <input
                        name="Country"
                        value={formData.Country}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                        placeholder="Enter your country"
                    />
                </Field>

                <Field label="Gender" icon={User}>
                    <select
                        name="Gender"
                        value={formData.Gender}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </Field>

                <Field label="Date of Birth" icon={Calendar}>
                    <input
                        type="date"
                        name="DateOfBirth"
                        value={formData.DateOfBirth}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white transition-all"
                    />
                </Field>

                {/* Read-only fields */}
                <Field label="Role" hint="Read-only">
                    <input
                        value={(user.role || user.Role || 'DONOR').toUpperCase()}
                        disabled
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                </Field>

                <Field label="Verification Status" hint="Read-only">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-2 rounded-lg font-medium text-sm flex-1 text-center ${user.verificationStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : user.verificationStatus === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {user.verificationStatus || 'N/A'}
                        </span>
                    </div>
                </Field>

                <Field label="Account Status" hint="Read-only">
                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-2 rounded-lg font-medium text-sm flex-1 text-center ${user.accountStatus === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                            {user.accountStatus || 'ACTIVE'}
                        </span>
                    </div>
                </Field>
            </div>

            {/* Save Button */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                    {hasChanges() ? (
                        <span className="text-orange-600 font-medium">You have unsaved changes</span>
                    ) : (
                        <span>No changes to save</span>
                    )}
                </p>
                <button
                    onClick={() => onSave('personal', formData)}
                    disabled={!hasChanges() || saving}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all shadow-sm ${!hasChanges() || saving
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-95'
                        }`}
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default ProfilePage;

const Field = ({ label, hint, icon: Icon, children }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {Icon && <Icon size={16} className="text-gray-400" />}
            {label}
            {hint && <span className="text-xs text-gray-400">({hint})</span>}
        </label>
        {children}
    </div>
);

