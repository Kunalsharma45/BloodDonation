import { useState, useEffect } from "react";
import client from "../../api/client";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

const ProfileUpdatesTab = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const res = await client.get("/api/admin/profile-updates");
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile updates");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this update?`)) return;
        try {
            await client.put(`/api/admin/profile-updates/${id}/action`, { action });
            toast.success(`Request ${action}`);
            setRequests(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Action failed");
        }
    };

    const DiffView = ({ oldData, newData }) => {
        const keys = ["Name", "City", "PhoneNumber", "bloodGroup", "Gender", "DateOfBirth", "State", "Country"];
        const fieldLabels = {
            Name: "Name",
            City: "City",
            PhoneNumber: "Phone",
            bloodGroup: "Blood Group",
            Gender: "Gender",
            DateOfBirth: "Date of Birth",
            State: "State",
            Country: "Country"
        };

        return (
            <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1 mt-2 bg-gray-50 p-2 rounded border">
                <div className="font-semibold text-gray-500 border-b col-span-2 mb-1 pb-1">Changes</div>
                {keys.map(key => {
                    const oldValue = oldData[key];
                    const newValue = newData[key];

                    // Format dates for display
                    const formatValue = (val) => {
                        if (!val) return '-';
                        if (key === 'DateOfBirth' && val) {
                            return new Date(val).toLocaleDateString();
                        }
                        return val;
                    };

                    if (formatValue(oldValue) !== formatValue(newValue)) {
                        return (
                            <div key={key} className="col-span-2 py-1 border-b border-dashed last:border-0">
                                <div className="text-[10px] text-gray-400 mb-0.5">{fieldLabels[key]}</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-red-500 line-through opacity-70">{formatValue(oldValue)}</div>
                                    <div className="text-green-600 font-medium">{formatValue(newValue)}</div>
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Profile Updates</h2>
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req._id} className="border rounded-lg p-4 hover:shadow-sm transition">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-gray-800">{req.userId?.Name || "User"}</p>
                                <p className="text-xs text-gray-500">{req.userId?.Email}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAction(req._id, "APPROVED")}
                                    className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                                    title="Approve"
                                >
                                    <Check size={18} />
                                </button>
                                <button
                                    onClick={() => handleAction(req._id, "REJECTED")}
                                    className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                    title="Reject"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <DiffView oldData={req.currentData} newData={req.updates} />

                        <div className="mt-2 text-[10px] text-gray-400 text-right">
                            Requested: {new Date(req.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="text-center py-8 text-gray-500 italic">No pending update requests.</div>
                )}
            </div>
            {loading && <div className="text-center mt-2 text-xs text-gray-400">Loading...</div>}
        </div>
    );
};

export default ProfileUpdatesTab;
