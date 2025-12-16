import { useState } from "react";
import client from "../../api/client";
import { toast } from "sonner";

const BroadcastTab = () => {
  const [form, setForm] = useState({
    type: "GENERAL",
    targetRole: "",
    bloodGroup: "",
    city: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.message) {
      toast.error("Message is required");
      return;
    }
    try {
      setSending(true);
      const res = await client.post("/api/admin/broadcast", form);
      toast.success(`Notification sent to ${res.data?.sent || 0} recipients`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Send Broadcast</h2>
        <p className="text-sm text-gray-500">Target by role, blood group, or city.</p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={submit}>
        <div>
          <label className="text-xs text-gray-500">Notification Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="GENERAL">General</option>
            <option value="REQUEST">Request Alert</option>
            <option value="APPOINTMENT">Appointment</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Target Role</label>
          <select
            name="targetRole"
            value={form.targetRole}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="DONOR">Donors</option>
            <option value="ORGANIZATION">Organizations</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Blood Group (optional)</label>
          <select
            name="bloodGroup"
            value={form.bloodGroup}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Any</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">City (optional)</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g., Delhi"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-gray-500">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Emergency: O+ blood urgently needed at..."
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={sending}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Broadcast"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BroadcastTab;

