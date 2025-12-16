import React, { useState } from 'react';
import {
    Settings as SettingsIcon,
    Droplet,
    Mail,
    Shield,
    Database,
    AlertTriangle,
    Bell,
    Globe,
    Server,
    Key,
    CheckCircle,
    Save,
    RefreshCw,
    Upload,
    Download,
    Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import AdminSidebar from './AdminSidebar';

const AdminSettings = () => {
    // System Settings
    const [systemSettings, setSystemSettings] = useState({
        platformName: 'LiForce',
        contactEmail: 'admin@liforce.com',
        supportPhone: '+91 9876543210',
        maintenanceMode: false,
        debugMode: false
    });

    // Blood Stock Settings
    const [stockSettings, setStockSettings] = useState({
        lowStockThreshold: 20,
        criticalStockThreshold: 10,
        autoApproveRequests: false,
        autoAlertLowStock: true,
        stockCheckInterval: '24h'
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUsername: 'noreply@liforce.com',
        smtpPassword: '••••••••',
        fromEmail: 'noreply@liforce.com',
        fromName: 'LiForce Blood Management'
    });

    // Security Settings
    const [securitySettings, setSecuritySettings] = useState({
        sessionTimeout: '30',
        maxLoginAttempts: '5',
        passwordMinLength: '8',
        requireSpecialChar: true,
        requireNumber: true,
        requireUppercase: true,
        enableIpWhitelist: false
    });

    // Backup Settings
    const [backupSettings, setBackupSettings] = useState({
        autoBackup: true,
        backupFrequency: 'daily',
        retentionDays: '30',
        backupLocation: 'Database/Backups/',
        lastBackup: '2025-12-16 22:30:00'
    });

    // API Settings
    const [apiSettings, setApiSettings] = useState({
        enableApi: true,
        rateLimit: '100',
        rateLimitPeriod: '1h',
        requireApiKey: true,
        apiVersion: 'v1'
    });

    const [loading, setLoading] = useState(false);

    // Handlers
    const handleSaveSystemSettings = async () => {
        setLoading(true);
        try {
            // await adminApi.updateSystemSettings(systemSettings);
            toast.success('System settings saved successfully');
        } catch (error) {
            toast.error('Failed to save system settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStockSettings = async () => {
        setLoading(true);
        try {
            // await adminApi.updateStockSettings(stockSettings);
            toast.success('Stock settings saved successfully');
        } catch (error) {
            toast.error('Failed to save stock settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEmailSettings = async () => {
        setLoading(true);
        try {
            // await adminApi.updateEmailSettings(emailSettings);
            toast.success('Email settings saved successfully');
        } catch (error) {
            toast.error('Failed to save email settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSecuritySettings = async () => {
        setLoading(true);
        try {
            // await adminApi.updateSecuritySettings(securitySettings);
            toast.success('Security settings saved successfully');
        } catch (error) {
            toast.error('Failed to save security settings');
        } finally {
            setLoading(false);
        }
    };

    const handleTestEmail = async () => {
        try {
            toast.info('Sending test email...');
            // await adminApi.sendTestEmail();
            setTimeout(() => {
                toast.success('Test email sent successfully!');
            }, 2000);
        } catch (error) {
            toast.error('Failed to send test email');
        }
    };

    const handleBackupNow = async () => {
        try {
            toast.info('Starting backup...');
            // await adminApi.createBackup();
            setTimeout(() => {
                setBackupSettings({ ...backupSettings, lastBackup: new Date().toISOString() });
                toast.success('Backup created successfully!');
            }, 3000);
        } catch (error) {
            toast.error('Backup failed');
        }
    };

    const handleRestoreBackup = () => {
        if (window.confirm('Are you sure you want to restore from backup? This will overwrite current data.')) {
            toast.info('Restore functionality will be implemented with backend');
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar />

            <main className="flex-1 ml-0 md:ml-20 lg:ml-64 p-6 md:p-8">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">System Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Configure platform-wide settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* System Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Globe className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">System Settings</h3>
                                <p className="text-xs text-gray-500">Basic platform configuration</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Platform Name
                                </label>
                                <input
                                    type="text"
                                    value={systemSettings.platformName}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, platformName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    value={systemSettings.contactEmail}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Support Phone
                                </label>
                                <input
                                    type="tel"
                                    value={systemSettings.supportPhone}
                                    onChange={(e) => setSystemSettings({ ...systemSettings, supportPhone: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Maintenance Mode</p>
                                        <p className="text-xs text-gray-500">Disable public access</p>
                                    </div>
                                    <button
                                        onClick={() => setSystemSettings({ ...systemSettings, maintenanceMode: !systemSettings.maintenanceMode })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${systemSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${systemSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Debug Mode</p>
                                        <p className="text-xs text-gray-500">Enable verbose logging</p>
                                    </div>
                                    <button
                                        onClick={() => setSystemSettings({ ...systemSettings, debugMode: !systemSettings.debugMode })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${systemSettings.debugMode ? 'bg-yellow-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${systemSettings.debugMode ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSystemSettings}
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save System Settings
                            </button>
                        </div>
                    </div>

                    {/* Blood Stock Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                <Droplet className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Blood Stock Settings</h3>
                                <p className="text-xs text-gray-500">Configure stock thresholds</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Low Stock Threshold (units)
                                </label>
                                <input
                                    type="number"
                                    value={stockSettings.lowStockThreshold}
                                    onChange={(e) => setStockSettings({ ...stockSettings, lowStockThreshold: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Critical Stock Threshold (units)
                                </label>
                                <input
                                    type="number"
                                    value={stockSettings.criticalStockThreshold}
                                    onChange={(e) => setStockSettings({ ...stockSettings, criticalStockThreshold: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Check Interval
                                </label>
                                <select
                                    value={stockSettings.stockCheckInterval}
                                    onChange={(e) => setStockSettings({ ...stockSettings, stockCheckInterval: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="6h">Every 6 hours</option>
                                    <option value="12h">Every 12 hours</option>
                                    <option value="24h">Every 24 hours</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Auto-Approve Requests</p>
                                        <p className="text-xs text-gray-500">Automatically approve valid requests</p>
                                    </div>
                                    <button
                                        onClick={() => setStockSettings({ ...stockSettings, autoApproveRequests: !stockSettings.autoApproveRequests })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${stockSettings.autoApproveRequests ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stockSettings.autoApproveRequests ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Auto Alert Low Stock</p>
                                        <p className="text-xs text-gray-500">Send alerts when stock is low</p>
                                    </div>
                                    <button
                                        onClick={() => setStockSettings({ ...stockSettings, autoAlertLowStock: !stockSettings.autoAlertLowStock })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${stockSettings.autoAlertLowStock ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${stockSettings.autoAlertLowStock ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleSaveStockSettings}
                                disabled={loading}
                                className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Stock Settings
                            </button>
                        </div>
                    </div>

                    {/* Email Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Email Settings</h3>
                                <p className="text-xs text-gray-500">SMTP configuration</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SMTP Host
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSettings.smtpHost}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SMTP Port
                                    </label>
                                    <input
                                        type="text"
                                        value={emailSettings.smtpPort}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Username
                                </label>
                                <input
                                    type="text"
                                    value={emailSettings.smtpUsername}
                                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    SMTP Password
                                </label>
                                <input
                                    type="password"
                                    value={emailSettings.smtpPassword}
                                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Email
                                </label>
                                <input
                                    type="email"
                                    value={emailSettings.fromEmail}
                                    onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    From Name
                                </label>
                                <input
                                    type="text"
                                    value={emailSettings.fromName}
                                    onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveEmailSettings}
                                    disabled={loading}
                                    className="flex-1 bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save
                                </button>
                                <button
                                    onClick={handleTestEmail}
                                    className="px-4 py-2.5 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 flex items-center justify-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    Test
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
                                <p className="text-xs text-gray-500">Password & session policies</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Session Timeout (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.sessionTimeout}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Login Attempts
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.maxLoginAttempts}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Min Length
                                </label>
                                <input
                                    type="number"
                                    value={securitySettings.passwordMinLength}
                                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Require Special Character</span>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireSpecialChar}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, requireSpecialChar: e.target.checked })}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Require Number</span>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireNumber}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, requireNumber: e.target.checked })}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Require Uppercase</span>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.requireUppercase}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, requireUppercase: e.target.checked })}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700">Enable IP Whitelist</span>
                                    <input
                                        type="checkbox"
                                        checked={securitySettings.enableIpWhitelist}
                                        onChange={(e) => setSecuritySettings({ ...securitySettings, enableIpWhitelist: e.target.checked })}
                                        className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSaveSecuritySettings}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Security Settings
                            </button>
                        </div>
                    </div>

                    {/* Database & Backup */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Database & Backup</h3>
                                <p className="text-xs text-gray-500">Backup configuration</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Backup Frequency
                                </label>
                                <select
                                    value={backupSettings.backupFrequency}
                                    onChange={(e) => setBackupSettings({ ...backupSettings, backupFrequency: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="hourly">Hourly</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Retention Days
                                </label>
                                <input
                                    type="number"
                                    value={backupSettings.retentionDays}
                                    onChange={(e) => setBackupSettings({ ...backupSettings, retentionDays: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Backup Location
                                </label>
                                <input
                                    type="text"
                                    value={backupSettings.backupLocation}
                                    readOnly
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                />
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500 mb-1">Last Backup</p>
                                <p className="text-sm font-medium text-gray-800">{backupSettings.lastBackup}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="font-medium text-gray-800">Auto Backup</p>
                                        <p className="text-xs text-gray-500">Automatic scheduled backups</p>
                                    </div>
                                    <button
                                        onClick={() => setBackupSettings({ ...backupSettings, autoBackup: !backupSettings.autoBackup })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${backupSettings.autoBackup ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${backupSettings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleBackupNow}
                                        className="px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Backup Now
                                    </button>
                                    <button
                                        onClick={handleRestoreBackup}
                                        className="px-4 py-2.5 border-2 border-orange-600 text-orange-600 rounded-lg font-medium hover:bg-orange-50 flex items-center justify-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Restore
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* API Settings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Key className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">API Settings</h3>
                                <p className="text-xs text-gray-500">API configuration & limits</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    API Version
                                </label>
                                <input
                                    type="text"
                                    value={apiSettings.apiVersion}
                                    readOnly
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rate Limit (requests)
                                </label>
                                <input
                                    type="number"
                                    value={apiSettings.rateLimit}
                                    onChange={(e) => setApiSettings({ ...apiSettings, rateLimit: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rate Limit Period
                                </label>
                                <select
                                    value={apiSettings.rateLimitPeriod}
                                    onChange={(e) => setApiSettings({ ...apiSettings, rateLimitPeriod: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                >
                                    <option value="1m">Per minute</option>
                                    <option value="1h">Per hour</option>
                                    <option value="1d">Per day</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Enable API</p>
                                        <p className="text-xs text-gray-500">Allow API requests</p>
                                    </div>
                                    <button
                                        onClick={() => setApiSettings({ ...apiSettings, enableApi: !apiSettings.enableApi })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${apiSettings.enableApi ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${apiSettings.enableApi ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">Require API Key</p>
                                        <p className="text-xs text-gray-500">Mandate authentication</p>
                                    </div>
                                    <button
                                        onClick={() => setApiSettings({ ...apiSettings, requireApiKey: !apiSettings.requireApiKey })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${apiSettings.requireApiKey ? 'bg-green-600' : 'bg-gray-300'
                                            }`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${apiSettings.requireApiKey ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save API Settings
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
