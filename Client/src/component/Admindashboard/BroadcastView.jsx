import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import {
    Megaphone,
    Send,
    History,
    Users,
    Calendar,
    CheckCircle,
    Info
} from "lucide-react";

const BroadcastView = () => {
    const [activeTab, setActiveTab] = useState("COMPOSE"); // COMPOSE, HISTORY
    const [loading, setLoading] = useState(false);

    // Compose State
    const [formData, setFormData] = useState({
        message: "",
        type: "GENERAL",
        targetRole: "",
        bloodGroup: "",
        city: ""
    });

    // History State
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (activeTab === "HISTORY") {
            fetchHistory();
        }
    }, [activeTab, page]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getSentNotifications({ page, limit: 10 });
            setHistory(res.items || []);
            setTotal(res.total || 0);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load history");
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!formData.message) return toast.error("Message is required");

        setLoading(true);
        try {
            const res = await adminApi.broadcast(formData);
            if (res.sent === 0) {
                toast.info("No recipients found for these criteria");
            } else {
                toast.success(`Broadcast sent to ${res.sent} recipients`);
                setFormData({
                    message: "",
                    type: "GENERAL",
                    targetRole: "",
                    bloodGroup: "",
                    city: ""
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to send broadcast");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Megaphone className="text-indigo-600" size={24} />
                        Broadcast Notifications
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Send announcements to donors, organizations, or specific groups.
                    </p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("COMPOSE")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "COMPOSE"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Send size={16} /> Compose
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab("HISTORY")}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "HISTORY"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <History size={16} /> History
                        </div>
                    </button>
                </div>
            </div>

            {/* COMPOSE TAB */}
            {activeTab === "COMPOSE" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Send size={18} className="text-indigo-500" />
                            New Message
                        </h3>
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                                <textarea
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none h-32 resize-none text-sm"
                                    placeholder="Type your announcement here..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Role</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
                                        value={formData.targetRole}
                                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                                    >
                                        <option value="">All Roles</option>
                                        <option value="DONOR">Donors</option>
                                        <option value="ORGANIZATION">Organizations</option>
                                        <option value="ADMIN">Admins</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Audience Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="GENERAL">General Announcement</option>
                                        <option value="URGENT">Urgent Appeal</option>
                                        <option value="EVENT">Event Invitation</option>
                                        <option value="STOCK_ALERT">Stock Alert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                                    <Filter size={14} /> Advanced Filters (Optional)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                                            placeholder="e.g. New York"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Blood Group</label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white"
                                            value={formData.bloodGroup}
                                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                        >
                                            <option value="">Any</option>
                                            {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => (
                                                <option key={g} value={g}>{g}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 disabled:opacity-50 font-medium flex items-center gap-2"
                                >
                                    {loading ? "Sending..." : (
                                        <>
                                            <Send size={18} /> Send Broadcast
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 h-fit">
                        <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <Info size={18} />
                            Best Practices
                        </h4>
                        <ul className="space-y-3 text-sm text-indigo-800">
                            <li className="flex gap-2">
                                <span className="mt-1">•</span>
                                Use <strong>Urgent Appeal</strong> only for critical blood shortages.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1">•</span>
                                Filter by <strong>City</strong> to avoid spamming users with irrelevant requests.
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1">•</span>
                                Keep messages concise and action-oriented.
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "HISTORY" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Sent By</th>
                                <th className="px-6 py-4 font-semibold">Audience</th>
                                <th className="px-6 py-4 font-semibold">Recipients</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading history...</td></tr>
                            ) : history.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No broadcast history found.</td></tr>
                            ) : history.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(log.createdAt).toLocaleDateString()}
                                            <span className="text-xs text-gray-400">
                                                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">
                                        {log.adminId?.Name || "Admin"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <span className="font-semibold text-gray-700">
                                                {log.details?.type || "GENERAL"}
                                            </span>
                                            <span className="text-gray-500">
                                                Role: {log.details?.targetRole || "All"}
                                                {log.details?.city && ` • ${log.details.city}`}
                                                {log.details?.bloodGroup && ` • ${log.details.bloodGroup}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium text-xs">
                                            <Users size={12} />
                                            {log.details?.count || 0}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {total > 10 && (
                        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                            <span>Page {page} of {Math.ceil(total / 10)}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * 10 >= total}
                                    className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BroadcastView;
