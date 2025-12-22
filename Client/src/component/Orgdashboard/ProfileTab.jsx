import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import orgApi from '../../api/orgApi';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

const ProfileTab = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [formData, setFormData] = useState({
        organizationName: '',
        Name: '',
        Email: '',
        PhoneNumber: '',
        City: '',
        State: '',
        Country: '',
        licenseNo: '',
        DateOfBirth: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                organizationName: user.organizationName || '',
                Name: user.Name || '',
                Email: user.Email || '',
                PhoneNumber: user.PhoneNumber || '',
                City: user.City || '',
                State: user.State || '',
                Country: user.Country || '',
                licenseNo: user.licenseNo || '',
                DateOfBirth: user.DateOfBirth || ''
            });
            // Fetch pending profile update request
            fetchPendingRequest();
        }
    }, [user]);

    const fetchPendingRequest = async () => {
        try {
            const request = await orgApi.getPendingProfileUpdateRequest();
            setPendingRequest(request);
        } catch (err) {
            console.error('Failed to fetch pending request:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // Submit profile update request for admin approval
            await orgApi.submitProfileUpdateRequest(formData);

            toast.success('Profile update request submitted! Waiting for admin approval.');

            // Refresh pending request
            await fetchPendingRequest();
        } catch (err) {
            console.error('Failed to submit profile update request:', err);
            toast.error(err.response?.data?.message || 'Failed to submit profile update request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>

            {/* Tab */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <button className="px-4 py-2 text-red-600 border-b-2 border-red-600 font-medium">
                        Personal Info
                    </button>
                </div>
            </div>

            {/* Pending Update Alert */}
            {pendingRequest && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                    <div className="flex-1">
                        <h3 className="font-semibold text-yellow-800 mb-1">Profile Update Pending</h3>
                        <p className="text-sm text-yellow-700">
                            Your profile update request is waiting for admin approval. You'll be notified once it's reviewed.
                        </p>
                    </div>
                </div>
            )}

            {/* Profile Form */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="PhoneNumber"
                                value={formData.PhoneNumber}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City
                            </label>
                            <input
                                type="text"
                                name="City"
                                value={formData.City}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country
                            </label>
                            <input
                                type="text"
                                name="Country"
                                value={formData.Country}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="DateOfBirth"
                                value={formData.DateOfBirth ? formData.DateOfBirth.split('T')[0] : ''}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        {/* Email Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Blood Group */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Blood Group
                            </label>
                            <select
                                name="bloodGroup"
                                value={user?.bloodGroup || 'B+'}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            >
                                <option>B+</option>
                            </select>
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State
                            </label>
                            <input
                                type="text"
                                name="State"
                                value={formData.State}
                                onChange={handleChange}
                                placeholder="Enter your state"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gender
                            </label>
                            <select
                                name="Gender"
                                value={user?.Gender || ''}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            >
                                <option>Select Gender</option>
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-gray-400">(Read-only)</span>
                            </label>
                            <input
                                type="text"
                                value={user?.Role === 'organization' ? 'DONOR' : user?.Role?.toUpperCase() || 'DONOR'}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Verification Status <span className="text-gray-400">(Read-only)</span>
                        </label>
                        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-center">
                            <span className="text-green-700 font-medium">APPROVED</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Account Status <span className="text-gray-400">(Read-only)</span>
                        </label>
                        <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-center">
                            <span className="text-green-700 font-medium">ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">No changes to save</p>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
