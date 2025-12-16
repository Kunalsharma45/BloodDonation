import { useState } from "react";
import orgApi from "../../api/orgApi";
import { toast } from "sonner";

const CreateRequest = ({ onCreated }) => {
  const [form, setForm] = useState({
    group: "",
    units: 1,
    urgency: "MEDIUM",
    lat: "",
    lng: "",
    caseId: "",
    notes: "",
    component: "WB",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.group || !form.units || !form.lat || !form.lng) return;
    try {
      setLoading(true);
      const payload = {
        group: form.group,
        units: Number(form.units),
        urgency: form.urgency,
        lat: Number(form.lat),
        lng: Number(form.lng),
        caseId: form.caseId,
        notes: form.notes,
        component: form.component,
      };

      const res = await orgApi.createRequest(payload);

      setForm({ group: "", units: 1, urgency: "MEDIUM", lat: "", lng: "", caseId: "", notes: "", component: "WB" });
      onCreated?.(res); // API returns the document directly
      toast.success("Request created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={submit}>
      <div>
        <label className="text-sm text-gray-600">Blood Group</label>
        <select name="group" value={form.group} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required>
          <option value="">Select</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Units</label>
        <input name="units" type="number" min="1" value={form.units} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
      </div>
      <div>
        <label className="text-sm text-gray-600">Urgency</label>
        <select name="urgency" value={form.urgency} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
          {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Component</label>
        <input name="component" value={form.component} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Latitude</label>
        <input name="lat" value={form.lat} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
      </div>
      <div>
        <label className="text-sm text-gray-600">Longitude</label>
        <input name="lng" value={form.lng} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-600">Case ID</label>
        <input name="caseId" value={form.caseId} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-600">Notes</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={3} />
      </div>
      <div className="md:col-span-2">
        <button className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 disabled:opacity-60" disabled={loading}>
          {loading ? "Creating..." : "Create Request"}
        </button>
      </div>
    </form>
  );
};

export default CreateRequest;

