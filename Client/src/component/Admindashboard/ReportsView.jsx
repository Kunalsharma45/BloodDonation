import React, { useState, useEffect, useMemo } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import {
    BarChart,
    FileText,
    TrendingUp,
    Package,
    Download,
    Filter,
    ClipboardList
} from "lucide-react";
import { SafeLine, SafePie } from "./SafeChart";

const ReportsView = () => {
    const [activeTab, setActiveTab] = useState("SUMMARY"); // SUMMARY, REQUESTS, INVENTORY, AUDIT
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [dateRange, setDateRange] = useState("30d");

    useEffect(() => {
        fetchReport();
    }, [activeTab, dateRange]);

    const fetchReport = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === "SUMMARY") {
                res = await adminApi.getReportSummary({ range: dateRange });
            } else if (activeTab === "REQUESTS") {
                res = await adminApi.getReportRequests({ range: dateRange });
            } else if (activeTab === "INVENTORY") {
                res = await adminApi.getReportInventory();
            } else if (activeTab === "AUDIT") {
                res = await adminApi.getAuditLogs({ limit: 20 });
                setAuditLogs(res.items || []);
                setLoading(false);
                return;
            }
            setReportData(res);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load report data");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast.info("Export functionality coming soon (PDF/CSV generation)");
    };

    // Placeholder chart data if API returns empty
    const chartData = useMemo(() => ({
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        datasets: [
            {
                label: "Activity",
                data: [12, 19, 3, 5],
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                tension: 0.4,
                fill: true
            }
        ]
    }), []);

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="text-indigo-600" size={24} />
                        Analytics & Reports
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        System performance, inventory stats, and audit logs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-gray-50 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 3 Months</option>
                        <option value="1y">Last Year</option>
                    </select>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-indigo-100 transition-colors"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                    { id: "SUMMARY", label: "Overview", icon: TrendingUp },
                    { id: "REQUESTS", label: "Requests", icon: FileText },
                    { id: "INVENTORY", label: "Inventory", icon: Package },
                    { id: "AUDIT", label: "Audit Logs", icon: ClipboardList },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id
                            ? "bg-gray-800 text-white shadow-md"
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <>
                    {/* SUMMARY VIEW */}
                    {activeTab === "SUMMARY" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
                                <h4 className="font-bold text-gray-800 mb-4">Activity Trend</h4>
                                <div className="h-64">
                                    <SafeLine
                                        data={reportData?.chartData || chartData}
                                        options={{ maintainAspectRatio: false }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow text-white">
                                    <p className="text-white/80 text-sm font-medium">Total Donations</p>
                                    <h3 className="text-3xl font-bold mt-1">{reportData?.totalDonations || 0}</h3>
                                    <div className="mt-4 text-xs bg-white/20 inline-block px-2 py-1 rounded">
                                        +12% vs last month
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-3">Key Metrics</h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">New Donors</span>
                                            <span className="font-bold">{reportData?.newDonors || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Success Rate</span>
                                            <span className="font-bold text-green-600">98%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY VIEW */}
                    {activeTab === "INVENTORY" && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-4">Stock Distribution</h4>
                            <div className="h-64 w-full max-w-md mx-auto">
                                <SafePie
                                    data={{
                                        labels: Object.keys(reportData?.distribution || {}),
                                        datasets: [{
                                            data: Object.values(reportData?.distribution || {}),
                                            backgroundColor: [
                                                "#ef4444", "#f97316", "#eab308", "#22c55e",
                                                "#3b82f6", "#6366f1", "#a855f7", "#ec4899"
                                            ]
                                        }]
                                    }}
                                />
                            </div>
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Object.entries(reportData?.distribution || {}).map(([group, count]) => (
                                    <div key={group} className="text-center p-3 bg-gray-50 rounded-lg">
                                        <div className="text-xs text-gray-500 uppercase font-bold">Group {group}</div>
                                        <div className="text-lg font-bold text-gray-900">{count} U</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AUDIT LOGS VIEW */}
                    {activeTab === "AUDIT" && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Time</th>
                                        <th className="px-6 py-4">Action</th>
                                        <th className="px-6 py-4">Actor</th>
                                        <th className="px-6 py-4">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {auditLogs.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No audit logs found.
                                            </td>
                                        </tr>
                                    ) : auditLogs.map((log) => (
                                        <tr key={log._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 text-gray-500">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 font-medium text-gray-800">
                                                {log.action}
                                            </td>
                                            <td className="px-6 py-3 text-indigo-600">
                                                {log.actorName || log.actorId}
                                            </td>
                                            <td className="px-6 py-3 text-gray-600">
                                                {log.details || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* REQUESTS VIEW */}
                    {activeTab === "REQUESTS" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-2">Total Requests</h4>
                                    <div className="text-3xl font-bold text-indigo-600">{reportData?.total || 0}</div>
                                    <p className="text-xs text-gray-500 mt-1">In selected period</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-2">Fulfilled</h4>
                                    <div className="text-3xl font-bold text-green-600">{reportData?.fulfilled || 0}</div>
                                    <p className="text-xs text-gray-500 mt-1">Successfully completed</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-gray-800 mb-2">Urgency High</h4>
                                    <div className="text-3xl font-bold text-red-600">{reportData?.urgent || 0}</div>
                                    <p className="text-xs text-gray-500 mt-1">Critical/High urgency</p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4">Urgency Distribution</h4>
                                <div className="h-64 w-full max-w-md mx-auto">
                                    <SafePie
                                        data={{
                                            labels: Object.keys(reportData?.urgencyDistribution || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }),
                                            datasets: [{
                                                data: Object.values(reportData?.urgencyDistribution || { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }),
                                                backgroundColor: ["#ef4444", "#f97316", "#eab308", "#3b82f6"]
                                            }]
                                        }}
                                    />
                                </div>
                                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(reportData?.urgencyDistribution || {}).map(([level, count]) => (
                                        <div key={level} className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-xs text-gray-500 uppercase font-bold">{level}</div>
                                            <div className="text-lg font-bold text-gray-900">{count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReportsView;
