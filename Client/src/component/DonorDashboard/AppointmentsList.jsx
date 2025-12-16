import { useEffect, useState } from "react";
import client from "../../api/client";
import { toast } from "sonner";
import LoadingSkeleton from "../common/LoadingSkeleton";

const statusColor = {
  UPCOMING: "text-blue-600 bg-blue-50",
  COMPLETED: "text-green-600 bg-green-50",
  CANCELLED: "text-red-600 bg-red-50",
};

const AppointmentsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState("");
  const [orgId, setOrgId] = useState("");
  const [requestId, setRequestId] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filterStatus !== "ALL") params.status = filterStatus;
        const res = await client.get("/api/donor/appointments", { params });
        setItems(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filterStatus]);

  const book = async (e) => {
    e.preventDefault();
    if (!dateTime || !orgId) return;
    try {
      const res = await client.post("/api/donor/appointments", {
        organizationId: orgId,
        dateTime,
        requestId: requestId || undefined,
      });
      setItems((prev) => [...prev, res.data]);
      setDateTime("");
      setOrgId("");
      setRequestId("");
      toast.success("Appointment booked");
    } catch (err) {
      console.error(err);
      toast.error("Failed to book appointment");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Appointments</h3>
          <p className="text-sm text-gray-500">Upcoming and past appointments</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border rounded-lg px-3 py-2"
        >
          <option value="ALL">All</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm" onSubmit={book}>
        <input
          type="datetime-local"
          className="border rounded-lg px-3 py-2"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          required
        />
        <input
          type="text"
          className="border rounded-lg px-3 py-2"
          placeholder="Organization ID"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          required
        />
        <input
          type="text"
          className="border rounded-lg px-3 py-2"
          placeholder="Request ID (optional)"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
        />
        <button className="bg-red-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-700">
          Book
        </button>
      </form>

      {loading ? (
        <div className="space-y-2">
          <LoadingSkeleton count={3} height="h-16" />
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((a) => (
            <div key={a._id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">
                  {a.organizationId?.Name || "Organization"} —{" "}
                  {a.dateTime ? new Date(a.dateTime).toLocaleString() : ""}
                </p>
                <p className="text-xs text-gray-500">Request: {a.requestId || "N/A"}</p>
                {a.status === "UPCOMING" && (
                  <p className="text-[11px] text-blue-600 mt-1">Be on time and stay hydrated.</p>
                )}
              </div>
              <span className={`text-xs px-2 py-1 rounded ${statusColor[a.status] || "bg-gray-100 text-gray-700"}`}>
                {a.status}
              </span>
            </div>
          ))}
          {items.length === 0 && <p className="text-sm text-gray-500">No appointments yet.</p>}
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

