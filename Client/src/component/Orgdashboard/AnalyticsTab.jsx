import React, { useState, useEffect } from 'react';
import orgApi from '../../api/orgApi';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, Package, FileText, Calendar, BarChart3, PieChart } from 'lucide-react';
import { getOrgPermissions } from './orgUtils';

const MetricCard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-3 bg-${color}-50 rounded-lg`}>
                <Icon className={`text-${color}-600`} size={24} />
            </div>
            <span className="text-sm text-gray-500">{subtitle}</span>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        {children}
    </div>
);

const AnalyticsTab = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState(null);

    const orgType = user?.organizationType;
    const permissions = getOrgPermissions(orgType);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const data = await orgApi.getAnalytics();
            setAnalytics(data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
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

    const { requestStats, inventoryStats, appointmentStats } = analytics || {};

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Analytics & Insights</h1>
                <p className="text-gray-500 mt-1">Performance metrics and trends for your organization</p>
            </div>

            {/* Hospital Statistics */}
            {permissions.canCreateRequests && requestStats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricCard
                            icon={FileText}
                            title="Total Requests"
                            value={requestStats.total}
                            subtitle="All time"
                            color="blue"
                        />
                        <MetricCard
                            icon={TrendingUp}
                            title="Fulfilled"
                            value={requestStats.fulfilled}
                            subtitle={`${requestStats.fulfillmentRate}% rate`}
                            color="green"
                        />
                        <MetricCard
                            icon={Package}
                            title="Open Requests"
                            value={requestStats.open}
                            subtitle="Active"
                            color="orange"
                        />
                        <MetricCard
                            icon={BarChart3}
                            title="Cancelled"
                            value={requestStats.cancelled}
                            subtitle="Cancelled"
                            color="red"
                        />
                    </div>

                    {/* Request by Urgency */}
                    <ChartCard title="Requests by Urgency">
                        {requestStats.byUrgency && requestStats.byUrgency.length > 0 ? (
                            <div className="space-y-3">
                                {requestStats.byUrgency.map((item) => {
                                    const urgencyColors = {
                                        CRITICAL: 'bg-red-500',
                                        HIGH: 'bg-orange-500',
                                        MEDIUM: 'bg-yellow-500',
                                        LOW: 'bg-green-500'
                                    };
                                    const percentage = requestStats.total > 0 ? (item.count / requestStats.total * 100).toFixed(1) : 0;

                                    return (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <div className="w-24 text-sm font-medium text-gray-700">{item._id}</div>
                                            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                                <div
                                                    className={`${urgencyColors[item._id] || 'bg-gray-400'} h-full flex items-center px-3 text-white text-sm font-medium transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    {item.count}
                                                </div>
                                            </div>
                                            <div className="w-16 text-sm text-gray-600">{percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-6">No data available</p>
                        )}
                    </ChartCard>
                </>
            )}

            {/* Blood Bank Statistics */}
            {permissions.canManageInventory && inventoryStats && (
                <>
                    <ChartCard title="Inventory by Blood Group">
                        {inventoryStats.byGroup && inventoryStats.byGroup.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {inventoryStats.byGroup.map((item) => (
                                    <div key={item._id} className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
                                        <div className="text-2xl font-bold text-red-600 mb-1">{item._id}</div>
                                        <div className="text-3xl font-bold text-gray-800">{item.count}</div>
                                        <div className="text-xs text-gray-500 mt-1">units</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-6">No inventory data</p>
                        )}
                    </ChartCard>

                    <ChartCard title="Inventory by Status">
                        {inventoryStats.byStatus && inventoryStats.byStatus.length > 0 ? (
                            <div className="space-y-3">
                                {inventoryStats.byStatus.map((item) => {
                                    const totalUnits = inventoryStats.byStatus.reduce((sum, s) => sum + s.count, 0);
                                    const percentage = totalUnits > 0 ? (item.count / totalUnits * 100).toFixed(1) : 0;
                                    const statusColors = {
                                        AVAILABLE: 'bg-green-500',
                                        RESERVED: 'bg-yellow-500',
                                        ISSUED: 'bg-blue-500',
                                        EXPIRED: 'bg-red-500'
                                    };

                                    return (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <div className="w-24 text-sm font-medium text-gray-700">{item._id}</div>
                                            <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                                                <div
                                                    className={`${statusColors[item._id] || 'bg-gray-400'} h-full flex items-center px-3 text-white text-sm font-medium transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                >
                                                    {item.count}
                                                </div>
                                            </div>
                                            <div className="w-16 text-sm text-gray-600">{percentage}%</div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-6">No inventory data</p>
                        )}
                    </ChartCard>
                </>
            )}

            {/* Appointment Statistics (All Orgs) */}
            {appointmentStats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                        icon={Calendar}
                        title="Total Appointments"
                        value={appointmentStats.total}
                        subtitle="All time"
                        color="purple"
                    />
                    <MetricCard
                        icon={TrendingUp}
                        title="Completed"
                        value={appointmentStats.completed}
                        subtitle="Successful donations"
                        color="green"
                    />
                    <MetricCard
                        icon={Calendar}
                        title="Upcoming"
                        value={appointmentStats.upcoming}
                        subtitle="Scheduled"
                        color="blue"
                    />
                </div>
            )}

            {!requestStats && !inventoryStats && appointmentStats && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <BarChart3 className="mx-auto mb-3 text-blue-600" size={48} />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Limited Analytics Available</h3>
                    <p className="text-gray-600">More detailed analytics will be available as you complete more transactions.</p>
                </div>
            )}
        </div>
    );
};

export default AnalyticsTab;
