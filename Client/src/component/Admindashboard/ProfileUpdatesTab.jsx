import { useState, useEffect } from "react";
import client from "../../api/client";
import { toast } from "sonner";
import { Check, X, Building2, User } from "lucide-react";

const ProfileUpdatesTab = () => {
    const [donorRequests, setDonorRequests] = useState([]);
    const [orgRequests, setOrgRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('organizations'); // 'donors' or 'organizations'

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            // Fetch both donor and organization profile update requests
            const [donorRes, orgRes] = await Promise.all([
                client.get("/api/admin/profile-updates").catch(() => ({ data: [] })),
                client.get("/api/admin/org-profile-update-requests").catch(() => ({ data: [] }))
            ]);
            setDonorRequests(donorRes.data || []);
            setOrgRequests(orgRes.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load profile updates");
        } finally {
            setLoading(false);
        }
    };

    const handleDonorAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this update?`)) return;
        try {
            await client.put(`/api/admin/profile-updates/${id}/action`, { action });
            toast.success(`Request ${action.toLowerCase()}`);
            setDonorRequests(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Action failed");
        }
    };

    const handleOrgAction = async (id, action) => {
        const isApprove = action === 'approve';
        if (!window.confirm(`Are you sure you want to ${action} this organization profile update?`)) return;

        try {
            if (isApprove) {
                await client.put(`/api/admin/org-profile-update-requests/${id}/approve`);
                toast.success("Organization profile updated successfully");
            } else {
                const reason = prompt("Enter rejection reason:");
                if (!reason) return;
                await client.put(`/api/admin/org-profile-update-requests/${id}/reject`, { reason });
                toast.success("Request rejected");
            }
            setOrgRequests(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error(err);
            toast.error("Action failed");
        }
    };

    const DonorDiffView = ({ oldData, newData }) => {
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

    const OrgDiffView = ({ currentValues, requestedChanges }) => {
        const keys = ["organizationName", "Name", "Email", "PhoneNumber", "City", "State", "Country", "licenseNo"];
        const fieldLabels = {
            organizationName: "Organization Name",
            Name: "Contact Person",
            Email: "Email",
            PhoneNumber: "Phone",
            City: "City",
            State: "State",
            Country: "Country",
            licenseNo: "License Number"
        };

        return (
            <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1 mt-2 bg-gray-50 p-2 rounded border">
                <div className="font-semibold text-gray-500 border-b col-span-2 mb-1 pb-1">Requested Changes</div>
                {keys.map(key => {
                    const oldValue = currentValues?.[key];
                    const newValue = requestedChanges?.[key];

                    if (oldValue !== newValue && newValue) {
                        return (
                            <div key={key} className="col-span-2 py-1 border-b border-dashed last:border-0">
                                <div className="text-[10px] text-gray-400 mb-0.5">{fieldLabels[key]}</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="text-red-500 line-through opacity-70">{oldValue || '-'}</div>
                                    <div className="text-green-600 font-medium">{newValue}</div>
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

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('organizations')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'organizations'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Building2 size={16} />
                    Organizations ({orgRequests.length})
                </button>
                <button
                    onClick={() => setActiveTab('donors')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${activeTab === 'donors'
                            ? 'text-red-600 border-b-2 border-red-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <User size={16} />
                    Donors ({donorRequests.length})
                </button>
            </div>

            {/* Organization Requests */}
            {activeTab === 'organizations' && (
                <div className="space-y-4">
                    {orgRequests.map((req) => (
                        <div key={req._id} className="border rounded-lg p-4 hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                                        <Building2 size={16} className="text-blue-600" />
                                        {req.organizationId?.organizationName || "Organization"}
                                    </p>
                                    <p className="text-xs text-gray-500">{req.organizationId?.Email}</p>
                                    <p className="text-xs text-gray-400">
                                        Type: {req.organizationId?.organizationType === 'BANK' ? 'Blood Bank' : 'Hospital'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOrgAction(req._id, "approve")}
                                        className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                                        title="Approve"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleOrgAction(req._id, "reject")}
                                        className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                        title="Reject"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <OrgDiffView currentValues={req.currentValues} requestedChanges={req.requestedChanges} />

                            <div className="mt-2 text-[10px] text-gray-400 text-right">
                                Requested: {new Date(req.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {orgRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500 italic">No pending organization update requests.</div>
                    )}
                </div>
            )}

            {/* Donor Requests */}
            {activeTab === 'donors' && (
                <div className="space-y-4">
                    {donorRequests.map((req) => (
                        <div key={req._id} className="border rounded-lg p-4 hover:shadow-sm transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-gray-800 flex items-center gap-2">
                                        <User size={16} className="text-red-600" />
                                        {req.userId?.Name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500">{req.userId?.Email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDonorAction(req._id, "APPROVED")}
                                        className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
                                        title="Approve"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDonorAction(req._id, "REJECTED")}
                                        className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200"
                                        title="Reject"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <DonorDiffView oldData={req.currentData} newData={req.updates} />

                            <div className="mt-2 text-[10px] text-gray-400 text-right">
                                Requested: {new Date(req.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}

                    {donorRequests.length === 0 && (
                        <div className="text-center py-8 text-gray-500 italic">No pending donor update requests.</div>
                    )}
                </div>
            )}

            {loading && <div className="text-center mt-2 text-xs text-gray-400">Loading...</div>}
        </div>
    );
};

export default ProfileUpdatesTab;
