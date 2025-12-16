import { useState, useEffect } from "react";
import client from "../../api/client";
import { toast } from "sonner";

const CampsTab = () => {
    const [camps, setCamps] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        address: "",
        lat: "",
        lng: "",
        capacity: 50,
    });

    useEffect(() => {
        fetchCamps();
    }, []);

    const fetchCamps = async () => {
        try {
            const res = await client.get("/api/org/camps");
            setCamps(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.lat || !formData.lng) {
                toast.error("Please provide valid Lat/Lng coordinates");
                return;
            }
            await client.post("/api/org/camps", formData);
            toast.success("Camp created");
            setShowForm(false);
            fetchCamps();
            setFormData({ title: "", date: "", address: "", lat: "", lng: "", capacity: 50 });
        } catch (err) {
            console.error(err);
            toast.error("Failed to create camp");
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Donation Camps</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded hover:bg-red-100"
                >
                    {showForm ? "Cancel" : "Organize Camp"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <input
                            placeholder="Camp Title"
                            className="p-2 border rounded"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            className="p-2 border rounded"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Address"
                            className="p-2 border rounded md:col-span-2"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <input
                            placeholder="Latitude"
                            type="number" step="any"
                            className="p-2 border rounded"
                            value={formData.lat}
                            onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Longitude"
                            type="number" step="any"
                            className="p-2 border rounded"
                            value={formData.lng}
                            onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                            required
                        />
                        <input
                            placeholder="Capacity"
                            type="number"
                            className="p-2 border rounded"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-medium hover:bg-red-700">
                        Create Camp
                    </button>
                </form>
            )}

            <div className="space-y-3">
                {camps.map((camp) => (
                    <div key={camp._id} className="border p-3 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold text-gray-800">{camp.title}</h3>
                            <p className="text-sm text-gray-600">{new Date(camp.date).toLocaleDateString()} • {camp.location?.address}</p>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 text-xs rounded text-gray-700">{camp.status}</span>
                    </div>
                ))}
                {camps.length === 0 && <p className="text-gray-500 text-sm text-center">No camps scheduled.</p>}
            </div>
        </div>
    );
};

export default CampsTab;
