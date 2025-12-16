import { useState } from "react";
import client from "../../api/client";
import { toast } from "sonner";
import { X } from "lucide-react";

const EditProfileModal = ({ user, onClose, onRefresh }) => {
    const [formData, setFormData] = useState({
        Name: user.Name || "",
        City: user.City || "",
        PhoneNumber: user.PhoneNumber || "",
        bloodGroup: user.bloodGroup || user.Bloodgroup || ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.post("/api/donor/profile-update", formData);
            toast.success("Request submitted for Admin approval");
            onClose();
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-semibold text-gray-800">Edit Profile Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100">
                        Note: Changes require Admin approval. Your profile will be updated once approved.
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-100 outline-none"
                            value={formData.Name}
                            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                        <input
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-100 outline-none"
                            value={formData.City}
                            onChange={(e) => setFormData({ ...formData, City: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-100 outline-none"
                            value={formData.PhoneNumber}
                            onChange={(e) => setFormData({ ...formData, PhoneNumber: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                        <select
                            className="w-full p-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-100 outline-none"
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            required
                        >
                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-70 transition-colors"
                        >
                            {loading ? "Submitting..." : "Submit for Approval"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
