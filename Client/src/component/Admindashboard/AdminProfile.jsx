import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    Shield,
    Lock,
    Key,
    Globe,
    Bell,
    Moon,
    Sun,
    Monitor,
    Clock,
    MapPin,
    Filter,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import authApi from '../../api/authApi';

const AdminProfile = () => {
    const { user } = useAuth();

    // Basic Info State
    const [basicInfo, setBasicInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Security State
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Preferences State
    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'en',
        timezone: 'Asia/Kolkata',
        timeFormat: '24h',
        defaultFilter: '7days',
        notifications: {
            emailPending: true,
            inAppPending: true,
            emailAlerts: true,
            inAppAlerts: true
        }
    });

    // Session Info State
    const [sessionInfo, setSessionInfo] = useState({
        lastLogin: '2025-12-16 23:45:30',
        ipAddress: '192.168.1.100'
    });

    // Loading States
    const [loading, setLoading] = useState({
        basicInfo: false,
        password: false,
        preferences: false
    });

    // Load user data
    useEffect(() => {
        if (user) {
            setBasicInfo({
                name: user.Name || user.name || '',
                email: user.Email || user.email || '',
                phone: user.Phone || user.phone || ''
            });
        }
    }, [user]);

    // Handlers
    const handleBasicInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading({ ...loading, basicInfo: true });
        try {
            // await authApi.updateProfile(basicInfo);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading({ ...loading, basicInfo: false });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setLoading({ ...loading, password: true });
        try {
            await authApi.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Password changed successfully');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        } finally {
            setLoading({ ...loading, password: false });
        }
    };

    const handlePreferencesUpdate = async () => {
        setLoading({ ...loading, preferences: true });
        try {
            // await authApi.updatePreferences(preferences);
            toast.success('Preferences updated successfully');
        } catch (error) {
            toast.error('Failed to update preferences');
        } finally {
            setLoading({ ...loading, preferences: false });
        }
    };

    const toggle2FA = async () => {
        try {
            const newStatus = !twoFactorEnabled;
            // await authApi.toggle2FA(newStatus);
            setTwoFactorEnabled(newStatus);
            toast.success(`2FA ${newStatus ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            toast.error('Failed to toggle 2FA');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                                    <p className="text-xs text-gray-500">Update your personal details</p>
                                </div>
                            </div>

                            <form onSubmit={handleBasicInfoUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={basicInfo.name}
                                        onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={basicInfo.email}
                                            readOnly
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={basicInfo.phone}
                                            onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                                            className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Role
                                    </label>
                                    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                                        <Shield className="w-5 h-5 text-red-600" />
                                        <span className="font-semibold text-red-700">ADMIN</span>
                                        <span className="text-xs text-red-600 ml-auto">Read-only</span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading.basicInfo}
                                    className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading.basicInfo ? 'Updating...' : 'Update Basic Info'}
                                </button>
                            </form>
                        </div>

                        {/* Security */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                                    <p className="text-xs text-gray-500">Manage your password and 2FA</p>
                                </div>
                            </div>

                            {/* Change Password */}
                            <form onSubmit={handlePasswordChange} className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords.old ? "text" : "password"}
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                            className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter current password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-11 pr-11 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Confirm new password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading.password}
                                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading.password ? 'Changing...' : 'Change Password'}
                                </button>
                            </form>

                            {/* 2FA Toggle */}
                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-medium text-gray-800">Two-Factor Authentication</p>
                                            <p className="text-xs text-gray-500">Add an extra layer of security</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggle2FA}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFactorEnabled ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
                                    <p className="text-xs text-gray-500">Customize your experience</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Theme */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { value: 'light', icon: Sun, label: 'Light' },
                                            { value: 'dark', icon: Moon, label: 'Dark' },
                                            { value: 'auto', icon: Monitor, label: 'Auto' }
                                        ].map(({ value, icon: Icon, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => setPreferences({ ...preferences, theme: value })}
                                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${preferences.theme === value
                                                        ? 'border-purple-600 bg-purple-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 ${preferences.theme === value ? 'text-purple-600' : 'text-gray-600'
                                                    }`} />
                                                <span className={`text-sm font-medium ${preferences.theme === value ? 'text-purple-600' : 'text-gray-600'
                                                    }`}>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Language */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={preferences.language}
                                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>

                                {/* Timezone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Timezone
                                    </label>
                                    <select
                                        value={preferences.timezone}
                                        onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                        <option value="America/New_York">America/New_York (EST)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                                    </select>
                                </div>

                                {/* Time Format */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="w-4 h-4 inline mr-1" />
                                        Time Format
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: '12h', label: '12-hour (3:45 PM)' },
                                            { value: '24h', label: '24-hour (15:45)' }
                                        ].map(({ value, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => setPreferences({ ...preferences, timeFormat: value })}
                                                className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${preferences.timeFormat === value
                                                        ? 'border-purple-600 bg-purple-50 text-purple-600'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                    }`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Default Dashboard Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Filter className="w-4 h-4 inline mr-1" />
                                        Default Dashboard Filter
                                    </label>
                                    <select
                                        value={preferences.defaultFilter}
                                        onChange={(e) => setPreferences({ ...preferences, defaultFilter: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="today">Today</option>
                                        <option value="7days">Last 7 days</option>
                                        <option value="30days">Last 30 days</option>
                                        <option value="90days">Last 90 days</option>
                                    </select>
                                </div>

                                {/* Notification Preferences */}
                                <div className="pt-4 border-t border-gray-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        <Bell className="w-4 h-4 inline mr-1" />
                                        Notification Preferences
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Email - New Pending Requests</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.notifications.emailPending}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, emailPending: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">In-App - New Pending Requests</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.notifications.inAppPending}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, inAppPending: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">Email - Critical Alerts</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.notifications.emailAlerts}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, emailAlerts: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                            <span className="text-sm text-gray-700">In-App - Critical Alerts</span>
                                            <input
                                                type="checkbox"
                                                checked={preferences.notifications.inAppAlerts}
                                                onChange={(e) => setPreferences({
                                                    ...preferences,
                                                    notifications: { ...preferences.notifications, inAppAlerts: e.target.checked }
                                                })}
                                                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePreferencesUpdate}
                                    disabled={loading.preferences}
                                    className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading.preferences ? 'Saving...' : 'Save Preferences'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="space-y-6">
                        {/* Session Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Session Info</h3>
                                    <p className="text-xs text-gray-500">Current session details</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">Last Login</p>
                                    <p className="text-sm font-medium text-gray-800">{sessionInfo.lastLogin}</p>
                                </div>

                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 mb-1">IP Address</p>
                                    <p className="text-sm font-medium text-gray-800 font-mono">{sessionInfo.ipAddress}</p>
                                </div>

                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Active Session</p>
                                        <p className="text-xs text-green-600 mt-1">Your account is secure</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-sm p-6 text-white">
                            <h3 className="text-lg font-semibold mb-4">Account Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">Account Type</span>
                                    <span className="font-semibold">ADMIN</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">2FA Status</span>
                                    <span className={`text-sm font-semibold px-2 py-1 rounded ${twoFactorEnabled ? 'bg-green-500' : 'bg-yellow-500'
                                        }`}>
                                        {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">Profile Status</span>
                                    <span className="text-sm font-semibold px-2 py-1 bg-green-500 rounded">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProfile;
