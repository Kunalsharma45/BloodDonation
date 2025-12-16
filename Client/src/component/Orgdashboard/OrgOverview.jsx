import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Package, AlertTriangle, Calendar, FileText, Inbox, TrendingUp, Clock } from 'lucide-react';
import { getOrgPermissions, getOrgTypeLabel, getOrgTypeBadgeColor } from './orgUtils';

const StatCard = ({ icon: Icon, label, value, color = "red", onClick }) => (
    <div
        className={`bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">{label}</p>
                <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
            </div>
            <div className={`p-3 bg-${color}-50 rounded-lg`}>
                <Icon className={`text-${color}-600`} size={24} />
            </div>
        </div>
    </div>
);

const RequestCard = ({ request, onClick }) => {
    const urgencyColors = {
        CRITICAL: 'bg-red-100 text-red-700',
        HIGH: 'bg-orange-100 text-orange-700',
        MEDIUM: 'bg-yellow-100 text-yellow-700',
        LOW: 'bg-green-100 text-green-700'
    };

    return (
        <div className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick}>
            <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg text-gray-800">{request.bloodGroup}</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${urgencyColors[request.urgency] || urgencyColors.MEDIUM}`}>
                    {request.urgency}
                </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Units:</strong> {request.units}</p>
                <p><strong>Status:</strong> {request.status}</p>
                {request.caseId && <p className="text-xs text-gray-500">Case: {request.caseId}</p>}
                {request.createdBy?.organizationName && (
                    <p className="text-xs text-gray-500">From: {request.createdBy.organizationName}</p>
                )}
            </div>
        </div>
    );
};

const OrgOverview = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    const orgType = user?.organizationType;
    const permissions = getOrgPermissions(orgType);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const res = await client.get('/api/org/dashboard');
            setDashboardData(res.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    const { organization, stats, myRequests, incomingRequests, todayAppointments, inventoryAlerts } = dashboardData || {};

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            {organization?.organizationName || organization?.Name || 'Organization Dashboard'}
                        </h1>
                        <p className="text-gray-500">
                            {organization?.City && `📍 ${organization.City}`}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getOrgTypeBadgeColor(orgType)}`}>
                        {getOrgTypeLabel(orgType)}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {permissions.canManageInventory && (
                    <>
                        <StatCard
                            icon={Package}
                            label="Available Units"
                            value={stats?.availableUnits}
                            color="blue"
                            onClick={() => navigate('/org/inventory')}
                        />
                        <StatCard
                            icon={AlertTriangle}
                            label="Expiring Soon"
                            value={stats?.expiringSoon}
                            color="orange"
                        />
                    </>
                )}

                <StatCard
                    icon={Calendar}
                    label="Appointments Today"
                    value={todayAppointments?.length || 0}
                    color="green"
                    onClick={() => navigate('/org/appointments')}
                />

                {permissions.canCreateRequests && (
                    <StatCard
                        icon={FileText}
                        label="Open Requests"
                        value={myRequests?.length || 0}
                        color="purple"
                        onClick={() => navigate('/org/requests')}
                    />
                )}

                {permissions.canViewIncoming && (
                    <StatCard
                        icon={Inbox}
                        label="Incoming Requests"
                        value={incomingRequests?.length || 0}
                        color="red"
                        onClick={() => navigate('/org/incoming')}
                    />
                )}
            </div>

            {/* Two-column layout for requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* My Requests (Hospitals) */}
                {permissions.canCreateRequests && (
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FileText className="text-purple-600" size={20} />
                                My Blood Requests
                            </h2>
                            <button
                                onClick={() => navigate('/org/requests')}
                                className="text-sm font-medium text-purple-600 hover:text-purple-700"
                            >
                                View All →
                            </button>
                        </div>

                        {myRequests && myRequests.length > 0 ? (
                            <div className="space-y-3">
                                {myRequests.slice(0, 3).map((req) => (
                                    <RequestCard key={req._id} request={req} onClick={() => navigate('/org/requests')} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <FileText className="mx-auto mb-2 text-gray-300" size={48} />
                                <p>No active requests</p>
                                <button
                                    onClick={() => navigate('/org/requests')}
                                    className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium"
                                >
                                    Create New Request
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Incoming Requests (Blood Banks) */}
                {permissions.canViewIncoming && (
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Inbox className="text-red-600" size={20} />
                                Incoming Requests
                            </h2>
                            <button
                                onClick={() => navigate('/org/incoming')}
                                className="text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                View All →
                            </button>
                        </div>

                        {incomingRequests && incomingRequests.length > 0 ? (
                            <div className="space-y-3">
                                {incomingRequests.slice(0, 3).map((req) => (
                                    <RequestCard key={req._id} request={req} onClick={() => navigate('/org/incoming')} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">
                                <Inbox className="mx-auto mb-2 text-gray-300" size={48} />
                                <p>No matching requests</p>
                                <p className="text-sm text-gray-400 mt-1">Requests will appear when hospitals need blood groups you have in stock</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Row: Today's Appointments + Inventory Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Today's Appointments */}
                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Calendar className="text-green-600" size={20} />
                        Today's Appointments
                    </h2>

                    {todayAppointments && todayAppointments.length > 0 ? (
                        <div className="space-y-3">
                            {todayAppointments.map((appt) => (
                                <div key={appt._id} className="flex items-center justify-between border-l-4 border-green-500 pl-4 py-2">
                                    <div>
                                        <p className="font-medium text-gray-800">{appt.donorId?.Name || 'Unknown Donor'}</p>
                                        <p className="text-sm text-gray-500">
                                            <Clock size={14} className="inline mr-1" />
                                            {new Date(appt.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        {appt.donorId?.bloodGroup || 'N/A'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-6">
                            <Calendar className="mx-auto mb-2 text-gray-300" size={40} />
                            <p className="text-sm">No appointments scheduled for today</p>
                        </div>
                    )}
                </div>

                {/* Inventory Alerts (Blood Banks only) */}
                {permissions.canManageInventory && (
                    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                            <AlertTriangle className="text-orange-600" size={20} />
                            Inventory Alerts
                        </h2>

                        {inventoryAlerts && inventoryAlerts.length > 0 ? (
                            <div className="space-y-3">
                                {inventoryAlerts.map((item) => (
                                    <div key={item._id} className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-2">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.bloodGroup} - {item.component}</p>
                                            <p className="text-sm text-orange-600">
                                                Expires: {new Date(item.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {item.barcode && (
                                            <span className="text-xs text-gray-500">{item.barcode}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-6">
                                <TrendingUp className="mx-auto mb-2 text-gray-300" size={40} />
                                <p className="text-sm">No inventory expiring soon</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrgOverview;
