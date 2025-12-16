import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import {
    AlertCircle,
    CheckCircle,
    Bell,
    Clock,
    Droplet
} from "lucide-react";

const AlertsView = () => {
    const [loading, setLoading] = useState(false);
    const [alerts, setAlerts] = useState({ unfulfilled: [], expiringUnits: [] });
    const [filter, setFilter] = useState("ALL"); // ALL, CRITICAL, WARNING

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getAlerts();
            setAlerts(res || { unfulfilled: [], expiringUnits: [] });
        } catch (err) {
            console.error(err);
            toast.error("Failed to load alerts");
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, type) => {
        try {
            await adminApi.resolveAlert(id);
            toast.success("Alert marked as resolved");
            // Optimistic update
            if (type === "REQUEST") {
                setAlerts(prev => ({
                    ...prev,
                    unfulfilled: prev.unfulfilled.filter(a => a._id !== id)
                }));
            } else {
                setAlerts(prev => ({
                    ...prev,
                    expiringUnits: prev.expiringUnits.filter(a => a._id !== id)
                }));
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to resolve alert");
        }
    };

    const getSeverityColor = (type, data) => {
        if (type === "REQUEST") {
            return data.urgency === "Critical" ? "bg-red-50 text-red-700 border-red-100" : "bg-orange-50 text-orange-700 border-orange-100";
        }
        // Expiry
        const daysLeft = Math.ceil((new Date(data.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 2 ? "bg-red-50 text-red-700 border-red-100" : "bg-yellow-50 text-yellow-700 border-yellow-100";
    };

    // Combined list for display
    const allAlerts = [
        ...alerts.unfulfilled.map(a => ({ ...a, type: "REQUEST", date: a.createdAt })),
        ...alerts.expiringUnits.map(a => ({ ...a, type: "EXPIRY", date: a.expiryDate }))
    ].filter(alert => {
        if (filter === "ALL") return true;
        const isCritical = (alert.type === "REQUEST" && alert.urgency === "Critical") ||
            (alert.type === "EXPIRY" && Math.ceil((new Date(alert.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)) <= 2);
        return filter === "CRITICAL" ? isCritical : !isCritical;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <div className="animate-fade-in space-y-6">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <AlertCircle className="text-red-500" size={24} />
                        System Alerts
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        Monitor critical system events requiring attention.
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-gray-50 font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-100"
                    >
                        <option value="ALL">All Alerts</option>
                        <option value="CRITICAL">Critical Only</option>
                        <option value="WARNING">Warnings</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : allAlerts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-green-500" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">All Clear!</h3>
                    <p className="text-gray-500 mt-2">No active system alerts at the moment.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {allAlerts.map((alert) => {
                        const isRequest = alert.type === "REQUEST";
                        return (
                            <div
                                key={alert._id}
                                className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:shadow-md ${getSeverityColor(alert.type, alert)}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg bg-white/50`}>
                                        {isRequest ? <Bell size={20} /> : <Droplet size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold flex items-center gap-2">
                                            {isRequest ? "Unfulfilled Request" : "Expiring Blood Unit"}
                                            {isRequest && alert.urgency === "Critical" && (
                                                <span className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full uppercase tracking-wider">Critical</span>
                                            )}
                                        </h4>
                                        <p className="text-sm opacity-90 mt-1">
                                            {isRequest
                                                ? `Request for ${alert.units} units of ${alert.bloodGroup} by ${alert.hospitalName || "Hospital"} has been pending for over 2 hours.`
                                                : `Unit ${alert._id.substr(-6)} (${alert.bloodGroup}) is expiring on ${new Date(alert.expiryDate).toLocaleDateString()}.`
                                            }
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs font-medium opacity-75">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {isRequest
                                                    ? `Created: ${new Date(alert.createdAt).toLocaleString()}`
                                                    : `Expires: ${new Date(alert.expiryDate).toLocaleDateString()}`
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleResolve(alert._id, alert.type)}
                                    className="px-4 py-2 bg-white/80 hover:bg-white text-inherit font-semibold rounded-lg text-sm shadow-sm transition-colors whitespace-nowrap"
                                >
                                    Resolve
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AlertsView;
