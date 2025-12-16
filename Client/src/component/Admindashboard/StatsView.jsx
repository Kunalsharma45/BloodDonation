import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { RefreshCw } from "lucide-react";
import LoadingSkeleton from "../common/LoadingSkeleton";

const StatsView = () => {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            setError(null);
            const data = await adminApi.getSummary();
            setStats(data);
        } catch (err) {
            console.error('Failed to load admin stats:', err);
            setError('Failed to load stats');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 mb-6">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white">
                        <LoadingSkeleton width="w-20" height="h-3" className="mb-2" />
                        <LoadingSkeleton width="w-12" height="h-8" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    const cards = [
        { label: "Total Donors", value: stats.totalDonors || 0, color: "bg-blue-50 text-blue-700" },
        { label: "Verified", value: stats.verifiedDonors || 0, color: "bg-green-50 text-green-700" },
        { label: "Pending", value: stats.pendingDonors || 0, color: "bg-yellow-50 text-yellow-700" },
        { label: "Organizations", value: stats.totalOrgs || 0, color: "bg-purple-50 text-purple-700" },
        { label: "Total Requests", value: stats.totalRequests || 0, color: "bg-orange-50 text-orange-700" },
        { label: "Fulfilled", value: stats.fulfilledRequests || 0, color: "bg-teal-50 text-teal-700" },
        { label: "Success Rate", value: `${stats.successRate || 0}%`, color: "bg-indigo-50 text-indigo-700" },
        { label: "Blood Units", value: stats.totalUnits || 0, color: "bg-red-50 text-red-700" },
        { label: "Expiring Soon", value: stats.expiringUnits || 0, color: "bg-amber-50 text-amber-700" },
    ];

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                    <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
                {cards.map((c, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-gray-100 shadow-sm ${c.color}`}>
                        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{c.label}</p>
                        <p className="text-2xl font-bold mt-1">{c.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsView;
