import React, { useState, useEffect } from "react";
import orgApi from "../../api/orgApi";
import CreateRequest from "./CreateRequest";
import { toast } from "sonner";
import {
    FileText,
    Users,
    CheckCircle,
    Clock,
    MapPin,
    AlertCircle
} from "lucide-react";
import LoadingSkeleton from "../common/LoadingSkeleton";

const RequestsView = () => {
    const [requests, setRequests] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [selected, setSelected] = useState(null);
    const [matches, setMatches] = useState({ donors: [] });
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [fulfillNote, setFulfillNote] = useState("");

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await orgApi.getMyRequests();
            setRequests(res || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const openMatches = async (req) => {
        setSelected(req);
        setMatches({ donors: [] });
        setLoadingMatches(true);
        try {
            const res = await orgApi.getMatches(req._id);
            setMatches(res || { donors: [] });
        } catch (err) {
            console.error(err);
            toast.error("Failed to load matches");
        } finally {
            setLoadingMatches(false);
        }
    };

    const assignDonor = async (donorId) => {
        if (!selected) return;
        try {
            await orgApi.assignDonor(selected._id, donorId);
            toast.success("Donor assigned successfully");
            fetchRequests(); // Status updates to ASSIGNED
            // Don't close modal immediately so they can see result, or close? 
            // Better to close or refresh matches listing to show assigned status if supported
            // user request flow says: "Add org view of interested donors" - assuming manual assignment here
            setSelected(null);
        } catch (err) {
            console.error(err);
            toast.error("Failed to assign donor");
        }
    };

    const fulfill = async (req) => {
        const unitsReceived = Number(window.prompt("Units received?", req.units || 1) || req.units || 1);
        if (!unitsReceived) return;

        try {
            await orgApi.fulfillRequest(req._id, { unitsReceived, notes: fulfillNote });
            toast.success("Request marked fulfilled");
            setFulfillNote("");
            fetchRequests();
        } catch (err) {
            console.error(err);
            toast.error("Failed to fulfill request");
        }
    };

    const getUrgencyColor = (u) => {
        switch (u) {
            case 'CRITICAL': return 'bg-red-100 text-red-700';
            case 'HIGH': return 'bg-orange-100 text-orange-700';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FileText className="text-red-600" />
                            My Funding Requests
                        </h2>
                        <p className="text-sm text-gray-500">Create requests and find donors.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
                    >
                        {showForm ? "Close Form" : "Create Request"}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <CreateRequest onCreated={(r) => {
                            setRequests([...requests, r]);
                            setShowForm(false);
                        }} />
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        <LoadingSkeleton count={3} height="h-16" />
                    </div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        No active requests found. Create one to get started.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-left text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Group</th>
                                    <th className="p-4 font-semibold">Units</th>
                                    <th className="p-4 font-semibold">Urgency</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.map(req => (
                                    <tr key={req._id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs">
                                                {req.bloodGroup}
                                            </span>
                                            {req.caseId && <span className="text-xs text-gray-400 font-normal">#{req.caseId}</span>}
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">{req.units} units</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getUrgencyColor(req.urgency)}`}>
                                                {req.urgency}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                {req.status === 'FULFILLED' ? <CheckCircle size={14} className="text-green-500" /> :
                                                    req.status === 'OPEN' ? <Clock size={14} className="text-orange-500" /> :
                                                        <Users size={14} className="text-blue-500" />}
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                {req.status !== 'FULFILLED' && req.status !== 'CANCELLED' && (
                                                    <button
                                                        onClick={() => openMatches(req)}
                                                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition font-medium"
                                                    >
                                                        <Users size={12} /> Matches
                                                    </button>
                                                )}
                                                {req.status !== 'FULFILLED' && (
                                                    <button
                                                        onClick={() => fulfill(req)}
                                                        className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition font-medium"
                                                    >
                                                        <CheckCircle size={12} /> Fulfill
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Matches Modal */}
            {selected && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Users className="text-blue-600" size={20} />
                                    Donor Matches
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    For Request: <span className="font-medium text-gray-700">{selected.bloodGroup} ({selected.units} units)</span>
                                </p>
                            </div>
                            <button
                                onClick={() => { setSelected(null); setMatches({ donors: [] }); }}
                                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-0 overflow-y-auto flex-1 custom-scrollbar">
                            {loadingMatches ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                    <p className="text-gray-500 text-sm">Finding nearby donors...</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {(matches.donors || []).map((d) => (
                                        <div key={d._id} className="p-4 hover:bg-gray-50 transition flex justify-between items-center">
                                            <div className="flex gap-4 items-center">
                                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                                                    {d.bloodGroup}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{d.Name}</p>
                                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1"><MapPin size={10} /> {d.distance ? `${d.distance.toFixed(1)}km` : "Nearby"}</span>
                                                        {d.lastDonationDate && (
                                                            <span className="flex items-center gap-1"><Clock size={10} /> Last: {new Date(d.lastDonationDate).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => assignDonor(d._id)}
                                                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 shadow-sm shadow-red-200"
                                            >
                                                Assign Donor
                                            </button>
                                        </div>
                                    ))}
                                    {(matches.donors || []).length === 0 && (
                                        <div className="text-center py-12 px-6">
                                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle className="text-gray-400" size={32} />
                                            </div>
                                            <h4 className="font-semibold text-gray-800">No Matches Found</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                We couldn't find any donors matching the criteria near the requested location.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RequestsView;
