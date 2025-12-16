import { useState, useEffect } from "react";
import client from "../../api/client";
import { toast } from "sonner";

const IncomingRequestsTab = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reserving, setReserving] = useState(null);
    const [cannotHelp, setCannotHelp] = useState(null);

    useEffect(() => {
        fetchIncoming();
    }, []);

    const fetchIncoming = async () => {
        try {
            setLoading(true);
            const res = await client.get("/api/org/requests/incoming");
            setRequests(res.data || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load incoming requests");
        } finally {
            setLoading(false);
        }
    };

    const reserveUnits = async (req) => {
        try {
            setReserving(req._id);
            const res = await client.post(`/api/org/requests/${req._id}/reserve`);
            toast.success(res.data?.message || "Units reserved");
        } catch (err) {
            console.error(err);
            toast.error("Failed to reserve units");
        } finally {
            setReserving(null);
        }
    };

    const decline = async (req) => {
        try {
            setCannotHelp(req._id);
            await client.post(`/api/org/requests/${req._id}/cannot-help`);
            toast.message("Noted that you cannot help");
        } catch (err) {
            console.error(err);
            toast.error("Action failed");
        } finally {
            setCannotHelp(null);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Incoming Requests (Matching Inventory)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {requests.map((req) => (
                    <div key={req._id} className="border rounded-lg p-4 hover:shadow-md transition bg-blue-50 border-blue-100">
                        <div className="flex justify-between items-start mb-2">
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                {req.bloodGroup}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${req.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                    req.urgency === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                }`}>
                                {req.urgency}
                            </span>
                        </div>
                        <p className="font-semibold text-gray-800">{req.units} Units Needed</p>
                        <p className="text-sm text-gray-600 mt-1">Requested by: Organization</p>
                        <div className="mt-4 flex gap-2">
                            <button
                                className="flex-1 bg-blue-600 text-white py-1.5 rounded text-sm hover:bg-blue-700"
                                onClick={() => reserveUnits(req)}
                                disabled={reserving === req._id}
                            >
                                {reserving === req._id ? "Reserving..." : "Reserve Units"}
                            </button>
                            <button
                                className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-200"
                                onClick={() => decline(req)}
                                disabled={cannotHelp === req._id}
                            >
                                {cannotHelp === req._id ? "Noting..." : "Cannot help"}
                            </button>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No incoming requests match your current inventory.
                    </div>
                )}
            </div>
            {loading && <div className="text-center mt-4 text-gray-500">Loading...</div>}
        </div>
    );
};

export default IncomingRequestsTab;
