import React, { useState } from "react";
import { useDashboard } from "../../context/DashboardContext";
import adminApi from "../../api/adminApi";
import { SafePie } from "./SafeChart";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";

const StockView = () => {
    const {
        stock,
        settings,
        totalUnits,
        fetchDashboardData,
    } = useDashboard();

    const [showAddStockModal, setShowAddStockModal] = useState(false);
    const [stockEdit, setStockEdit] = useState({
        group: Object.keys(stock || {})[0] || "O+",
        change: 0,
        reason: "Donation",
    });

    // Derived data for charts
    const lowStockTypes = useMemo(
        () =>
            Object.entries(stock || {})
                .filter(([, v]) => v.units <= settings.threshold)
                .map(([k]) => k),
        [stock, settings.threshold]
    );

    // Pie chart data for blood type availability
    const pieData = useMemo(() => {
        const labels = Object.keys(stock || {});
        const data = labels.map((k) => (stock || {})[k]?.units || 0);
        return {
            labels,
            datasets: [
                {
                    label: "Units Available",
                    data,
                    backgroundColor: [
                        "#ef4444", "#dc2626", "#f87171", "#fb7185",
                        "#6366f1", "#818cf8", "#10b981", "#34d399",
                    ],
                    borderColor: "#fff",
                    borderWidth: 2,
                },
            ],
        };
    }, [stock]);

    const pieOptions = {
        plugins: {
            legend: {
                position: "bottom",
                labels: { padding: 15, font: { size: 11 } }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} units (${percentage}%)`;
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    const submitStockChange = async () => {
        const { group, change, reason } = stockEdit;
        if (!group) return;
        try {
            await adminApi.updateStock(group, Number(change), reason);
            toast.success("Stock updated successfully");
            setShowAddStockModal(false);
            setStockEdit({
                group: Object.keys(stock || {})[0] || "O+",
                change: 0,
                reason: "Donation",
            });
            fetchDashboardData();
        } catch (err) {
            console.error("Failed to update stock:", err);
            toast.error("Failed to update stock");
        }
    };

    return (
        <div className="animate-fade-in">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Stock Management</h3>
                    <p className="text-sm text-gray-500 mt-1">Manage blood groups, add/remove units, and view analytics.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddStockModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                        <Plus className="w-4 h-4" /> Adjust Stock
                    </button>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="font-bold mb-4">Stock Levels</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Group</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Units</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Reserved</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Safe Level</th>
                                    <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {Object.keys(stock || {}).map((g) => (
                                    <tr key={g} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium">{g}</td>
                                        <td className="px-4 py-3">{(stock || {})[g]?.units || 0}</td>
                                        <td className="px-4 py-3">{(stock || {})[g]?.reserved || 0}</td>
                                        <td className="px-4 py-3">{settings.threshold} U</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setStockEdit({ group: g, change: 0, reason: "Donation" });
                                                        setShowAddStockModal(true);
                                                    }}
                                                    className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-sm hover:bg-indigo-100"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="font-bold mb-4">Blood Type Availability</h4>
                    <div className="h-64">
                        <SafePie data={pieData} options={pieOptions} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between items-center">
                            <span>Total units:</span>
                            <strong className="text-gray-900 text-sm">{totalUnits}</strong>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Blood groups:</span>
                            <strong className="text-gray-900 text-sm">{Object.keys(stock || {}).length}</strong>
                        </div>
                        {lowStockTypes.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-start gap-2">
                                    <span className="text-amber-600 font-medium">⚠️ Low stock:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {lowStockTypes.map((type) => (
                                            <span key={type} className="inline-flex items-center px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium text-xs">
                                                {type}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showAddStockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">Adjust Stock Level</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                                <select
                                    value={stockEdit.group}
                                    onChange={(e) => setStockEdit({ ...stockEdit, group: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                                >
                                    {Object.keys(stock || {}).map((g) => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Change Amount (+/- units)</label>
                                <input
                                    type="number"
                                    value={stockEdit.change}
                                    onChange={(e) => setStockEdit({ ...stockEdit, change: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use positive (e.g., 5) to add, negative (e.g., -5) to remove.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <select
                                    value={stockEdit.reason}
                                    onChange={(e) => setStockEdit({ ...stockEdit, reason: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none"
                                >
                                    <option value="Donation">Donation</option>
                                    <option value="Usage">Usage (Hospital Request)</option>
                                    <option value="Expired">Expired</option>
                                    <option value="Correction">Inventory Correction</option>
                                </select>
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowAddStockModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitStockChange}
                                className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                            >
                                Update Stock
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockView;
