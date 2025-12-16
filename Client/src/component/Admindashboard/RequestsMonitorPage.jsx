import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    RefreshCw,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    XCircle,
    Loader2,
    Download,
    Bell,
    TrendingUp,
    Users,
    Building2
} from 'lucide-react';
import requestApi from '../../api/requestApi';
import { toast } from 'sonner';
import {
    REQUEST_STATUS,
    REQUEST_URGENCY,
    BLOOD_GROUPS,
    getStatusColor,
    getUrgencyColor,
    formatDistance,
    calculateResponseTime,
    getComponentLabel,
    isRequestOverdue,
    isRequestActive
} from '../../constants/requestConstants';

const RequestsMonitorPage = () => {
    const [requests, setRequests] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        status: '',
        urgency: '',
        city: '',
        organizationId: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Fetch requests and summary
    const fetchData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            // Fetch both requests and summary
            const [requestsRes, summaryRes] = await Promise.all([
                requestApi.getAllRequests({
                    page: isRefresh ? 1 : page,
                    limit: 20,
                    ...(filters.status && { status: filters.status }),
                    ...(filters.urgency && { urgency: filters.urgency }),
                    ...(filters.city && { city: filters.city })
                }),
                requestApi.getRequestsSummary()
            ]);

            if (isRefresh) {
                setRequests(requestsRes.requests || requestsRes.items || []);
                setPage(1);
            } else {
                setRequests(prev =>
                    page === 1
                        ? requestsRes.requests || requestsRes.items || []
                        : [...prev, ...(requestsRes.requests || requestsRes.items || [])]
                );
            }

            setSummary(summaryRes);
            setHasMore(requestsRes.hasMore || false);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, filters.status, filters.urgency, filters.city]);

    const handleBroadcast = async (requestId) => {
        if (!window.confirm('Send broadcast notification to all compatible donors in the area?')) {
            return;
        }

        try {
            await requestApi.broadcastToDonors(requestId, 'Urgent: Blood donation needed!');
            toast.success('Broadcast sent to compatible donors');
        } catch (error) {
            console.error('Failed to broadcast:', error);
            toast.error('Failed to send broadcast');
        }
    };

    const handleExport = () => {
        toast.info('Export functionality will be implemented');
        // TODO: Generate CSV/Excel export
    };

    const filteredRequests = requests.filter(request => {
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            return (
                request.hospitalName?.toLowerCase().includes(searchLower) ||
                request.bloodGroup?.toLowerCase().includes(searchLower) ||
                request._id?.toLowerCase().includes(searchLower) ||
                request.location?.city?.toLowerCase().includes(searchLower)
            );
        }
        return true;
    });

    // Calculate page stats
    const pageStats = {
        total: filteredRequests.length,
        open: filteredRequests.filter(r => r.status === REQUEST_STATUS.OPEN).length,
        assigned: filteredRequests.filter(r => r.status === REQUEST_STATUS.ASSIGNED).length,
        fulfilled: filteredRequests.filter(r => r.status === REQUEST_STATUS.FULFILLED).length,
        overdue: filteredRequests.filter(r => isRequestActive(r.status) && isRequestOverdue(r.createdAt, r.urgency)).length
    };

    const activeFiltersCount = [filters.status, filters.urgency, filters.city].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            Request Monitoring
                        </h1>
                        <p className="text-gray-600 mt-1">System-wide blood request oversight and analytics</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5 text-gray-600" />
                            <span className="hidden md:inline">Export</span>
                        </button>
                        <button
                            onClick={() => fetchData(true)}
                            disabled={refreshing}
                            className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Requests</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total || 0}</p>
                                </div>
                                <FileText className="w-10 h-10 text-gray-400 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Fulfilled</p>
                                    <p className="text-2xl font-bold text-green-600 mt-1">{summary.fulfilled || 0}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {summary.total ? ((summary.fulfilled / summary.total) * 100).toFixed(1) : 0}% success rate
                                    </p>
                                </div>
                                <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">{summary.active || 0}</p>
                                </div>
                                <Clock className="w-10 h-10 text-blue-600 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Critical</p>
                                    <p className="text-2xl font-bold text-red-600 mt-1">{summary.critical || 0}</p>
                                </div>
                                <AlertTriangle className="w-10 h-10 text-red-600 opacity-20" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Avg Response</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-1">
                                        {summary.avgResponseTime || '0h'}
                                    </p>
                                </div>
                                <TrendingUp className="w-10 h-10 text-purple-600 opacity-20" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by hospital, blood group, city, or request ID..."
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-3 border rounded-lg flex items-center gap-2 transition-colors ${showFilters || activeFiltersCount > 0
                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    {Object.values(REQUEST_STATUS).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                                <select
                                    value={filters.urgency}
                                    onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Urgency Levels</option>
                                    {Object.values(REQUEST_URGENCY).map(urgency => (
                                        <option key={urgency} value={urgency}>{urgency}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input
                                    type="text"
                                    value={filters.city}
                                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                    placeholder="Filter by city"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ status: '', urgency: '', city: '', search: '' })}
                                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Current Page Stats */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Current View Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                        <p className="text-sm opacity-90">Showing</p>
                        <p className="text-2xl font-bold">{pageStats.total}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Open</p>
                        <p className="text-2xl font-bold">{pageStats.open}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Assigned</p>
                        <p className="text-2xl font-bold">{pageStats.assigned}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Fulfilled</p>
                        <p className="text-2xl font-bold">{pageStats.fulfilled}</p>
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Overdue</p>
                        <p className="text-2xl font-bold text-yellow-300">{pageStats.overdue}</p>
                    </div>
                </div>
            </div>

            {/* Request List */}
            {loading && page === 1 ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            ) : filteredRequests.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
                    <p className="text-gray-600">
                        {filters.status || filters.urgency || filters.city || filters.search
                            ? 'Try adjusting your filters'
                            : 'No blood requests in the system'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRequests.map((request) => {
                        const statusColor = getStatusColor(request.status);
                        const urgencyColor = getUrgencyColor(request.urgency);
                        const isOverdue = isRequestActive(request.status) && isRequestOverdue(request.createdAt, request.urgency);

                        return (
                            <div
                                key={request._id}
                                className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all ${isOverdue ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        {/* Blood Group Badge */}
                                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex flex-col items-center justify-center text-white shadow-md flex-shrink-0">
                                            <span className="text-xl font-bold leading-none">{request.bloodGroup}</span>
                                            <span className="text-[10px] opacity-90 mt-0.5">Blood</span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {request.hospitalName || request.organizationName}
                                                </h3>
                                                <div className={`px-3 py-1 rounded-full ${statusColor.bg} ${statusColor.text} text-xs font-semibold flex items-center gap-1.5`}>
                                                    <div className={`w-2 h-2 rounded-full ${statusColor.dot}`} />
                                                    {request.status}
                                                </div>
                                                <div className={`px-3 py-1 rounded-full ${urgencyColor.bg} ${urgencyColor.text} text-xs font-semibold`}>
                                                    {request.urgency}
                                                </div>
                                                {isOverdue && (
                                                    <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        OVERDUE
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span>#{request._id?.slice(-8)}</span>
                                                <span>•</span>
                                                <span>{request.location?.city || 'Unknown City'}</span>
                                                <span>•</span>
                                                <span>{calculateResponseTime(request.createdAt)} ago</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Actions */}
                                    {isRequestActive(request.status) && (
                                        <button
                                            onClick={() => handleBroadcast(request._id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                                        >
                                            <Bell className="w-4 h-4" />
                                            Broadcast
                                        </button>
                                    )}
                                </div>

                                {/* Request Details Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Units Needed</p>
                                        <p className="text-lg font-bold text-gray-900">{request.unitsNeeded}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Component</p>
                                        <p className="text-sm font-semibold text-gray-900">{getComponentLabel(request.component)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Interested Donors</p>
                                        <p className="text-lg font-bold text-blue-600 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {request.interestedDonorsCount || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Available Banks</p>
                                        <p className="text-lg font-bold text-purple-600 flex items-center gap-1">
                                            <Building2 className="w-4 h-4" />
                                            {request.availableBanksCount || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* Case Details */}
                                <p className="text-sm text-gray-700 line-clamp-2">{request.caseDetails}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load More */}
            {hasMore && filteredRequests.length > 0 && (
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={loading}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RequestsMonitorPage;
