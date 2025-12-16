import React, { useState, useEffect } from "react";
import orgApi from "../../api/orgApi";
import AddInventory from "./AddInventory";
import { toast } from "sonner";
import { Droplet, Calendar, Activity } from "lucide-react";
import LoadingSkeleton from "../common/LoadingSkeleton";

const InventoryView = () => {
    const [inventory, setInventory] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await orgApi.getInventory();
            setInventory(res || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchInventory(); }, []);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Droplet className="text-red-600" />
                            Blood & Oxygen Inventory
                        </h2>
                        <p className="text-sm text-gray-500">Manage your organization's blood stock.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
                    >
                        {showForm ? "Close Form" : "Add Unit"}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <AddInventory onAdded={(item) => {
                            setInventory([...inventory, item]);
                            toast.success("Unit added to inventory");
                            setShowForm(false);
                        }} />
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        <LoadingSkeleton count={3} height="h-16" />
                    </div>
                ) : inventory.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No inventory items found. Add units to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Group</th>
                                    <th className="p-4 font-semibold">Component</th>
                                    <th className="p-4 font-semibold">Details</th>
                                    <th className="p-4 font-semibold">Expiry</th>
                                    <th className="p-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {inventory.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition group">
                                        <td className="p-4">
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold">
                                                {item.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-gray-800">{item.component}</div>
                                            <div className="text-xs text-gray-500 font-mono">{item.barcode}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Activity size={14} />
                                                Collected: {new Date(item.collectionDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Calendar size={14} />
                                                {new Date(item.expiryDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                                                item.status === 'RESERVED' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default InventoryView;
