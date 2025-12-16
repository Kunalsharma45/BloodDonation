import { useState } from "react";
import client from "../../api/client";
import { toast } from "sonner";

const AddInventory = ({ onAdded }) => {
  const [form, setForm] = useState({
    group: "",
    component: "WB",
    collectionDate: "",
    expiryDate: "",
    barcode: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.group || !form.collectionDate || !form.expiryDate) return;
    try {
      setLoading(true);
      const res = await client.post("/api/org/inventory", {
        group: form.group,
        component: form.component,
        collectionDate: form.collectionDate,
        expiryDate: form.expiryDate,
        barcode: form.barcode,
      });
      setForm({ group: "", component: "WB", collectionDate: "", expiryDate: "", barcode: "" });
      onAdded?.(res.data);
      toast.success("Unit added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add inventory");
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
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm text-gray-600">Component</label>
        <input name="component" value={form.component} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Collection Date</label>
        <input type="date" name="collectionDate" value={form.collectionDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
      </div>
      <div>
        <label className="text-sm text-gray-600">Expiry Date</label>
        <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
      </div>
      <div className="md:col-span-2">
        <label className="text-sm text-gray-600">Barcode</label>
        <input name="barcode" value={form.barcode} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
      </div>
      <div className="md:col-span-2">
        <button className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700 disabled:opacity-60" disabled={loading}>
          {loading ? "Adding..." : "Add Unit"}
        </button>
      </div>
    </form>
  );
};

export default AddInventory;

