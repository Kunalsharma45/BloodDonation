import { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import LoadingSkeleton from "../common/LoadingSkeleton";
import ProfileUpdatesTab from "./ProfileUpdatesTab";

const PendingQueue = () => {
    const [activeTab, setActiveTab] = useState('DONOR'); // DONOR, ORGANIZATION, PROFILE_UPDATES
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (activeTab === 'PROFILE_UPDATES') return; // ProfileUpdatesTab handles its own fetching
        fetchPending();
    }, [activeTab]);

    const fetchPending = async () => {
        try {
            setLoading(true);
            let res;
            if (activeTab === 'DONOR') {
                res = await adminApi.getDonors({ status: 'PENDING', limit: 10 });
            } else {
                res = await adminApi.getOrgs({ status: 'PENDING', limit: 10 });
            }
            setPendingItems(res.items || []);
        } catch (err) {
            console.error(`Failed to load pending ${activeTab.toLowerCase()}s:`, err);
            toast.error("Failed to load pending items");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            setProcessingId(id);
            if (activeTab === 'DONOR') {
                await adminApi.approveDonor(id);
            } else {
                await adminApi.approveOrg(id);
            }
            setPendingItems((prev) => prev.filter((u) => u._id !== id));
            toast.success(`${activeTab === 'DONOR' ? 'Donor' : 'Organization'} approved successfully`);
        } catch (err) {
            console.error('Approval failed:', err);
            toast.error("Failed to approve");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        try {
            setProcessingId(id);
            const reason = prompt("Rejection reason (optional):");
            if (activeTab === 'DONOR') {
                await adminApi.rejectDonor(id, reason || "Not specified");
            } else {
                await adminApi.rejectOrg(id, reason || "Not specified");
            }
            setPendingItems((prev) => prev.filter((u) => u._id !== id));
            toast.success(`${activeTab === 'DONOR' ? 'Donor' : 'Organization'} rejected`);
        } catch (err) {
            console.error('Rejection failed:', err);
            toast.error("Failed to reject");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-800">Pending Verifications</h2>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('DONOR')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'DONOR' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Donors
                        </button>
                        <button
                            onClick={() => setActiveTab('ORGANIZATION')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'ORGANIZATION' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Organizations
                        </button>
                        <button
                            onClick={() => setActiveTab('PROFILE_UPDATES')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'PROFILE_UPDATES' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Profile Updates
                        </button>
                    </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {pendingItems.length} pending
                </span>
            </div>

            {loading && activeTab !== 'PROFILE_UPDATES' ? (
                <div className="space-y-4">
                    <LoadingSkeleton count={3} height="h-12" />
                </div>
            ) : activeTab === 'PROFILE_UPDATES' ? (
                <ProfileUpdatesTab />
            ) : (
                <div className="overflow-x-auto min-h-[200px]">
                    <table className="w-full text-sm">
                        <thead className="text-left text-gray-500">
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">{activeTab === 'DONOR' ? 'Blood Group' : 'Details'}</th>
                                <th className="py-2">City</th>
                                <th className="py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingItems.map((u) => (
                                <tr key={u._id} className="border-t">
                                    <td className="py-3 font-medium text-gray-800">{u.Name}</td>
                                    <td className="py-3 text-gray-600 text-xs">{u.Email}</td>
                                    <td className="py-3">
                                        {activeTab === 'DONOR' ? (
                                            <span className="px-2 py-0.5 rounded text-xs bg-red-50 text-red-700 font-medium">
                                                {u.bloodGroup || u.Bloodgroup || 'N/A'}
                                            </span>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                {u.LicenseNumber ? `Lic: ${u.LicenseNumber}` : 'Org Account'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 text-gray-700">{u.City}</td>
                                    <td className="py-3 flex gap-2 justify-end">
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200 transition disabled:opacity-50 flex items-center gap-1"
                                            onClick={() => handleApprove(u._id)}
                                            disabled={processingId === u._id}
                                        >
                                            {processingId === u._id ? (
                                                <><Loader2 size={12} className="animate-spin" /> ...</>
                                            ) : (
                                                'Approve'
                                            )}
                                        </button>
                                        <button
                                            className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                                            onClick={() => handleReject(u._id)}
                                            disabled={processingId === u._id}
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {pendingItems.length === 0 && (
                                <tr>
                                    <td className="py-12 text-center text-gray-500 text-sm" colSpan={5}>
                                        No pending {activeTab.toLowerCase()} verifications.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PendingQueue;
