import { useEffect, useState } from "react";
import donorApi from "../../api/donorApi";
import { toast } from "sonner";

import { Download, Award, Clock3, CalendarDays } from "lucide-react";
import { generateInvoice } from "./InvoiceGenerator";
import LoadingSkeleton from "../common/LoadingSkeleton";

const HistoryList = ({ user }) => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  // Filter states
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'ALL'
  });

  const load = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status && filters.status !== 'ALL') params.status = filters.status;

      const data = await donorApi.getHistory(params);
      setItems(data.appts || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // Initial load

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    load();
  };

  const badge = (status) => {
    const map = {
      COMPLETED: "bg-green-100 text-green-700",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Donation History</h3>
          <p className="text-sm text-gray-500">Your donation journey</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-sm font-semibold">
          Total: {total}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-3 rounded-lg flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="block w-full text-sm border-gray-300 rounded-md p-1.5 border"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="block w-full text-sm border-gray-300 rounded-md p-1.5 border"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="block w-full text-sm border-gray-300 rounded-md p-1.5 border bg-white"
          >
            <option value="ALL">All Past</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition"
        >
          Apply
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <LoadingSkeleton count={3} height="h-20" />
        </div>
      ) : (
        <div className="space-y-2 max-h-[440px] overflow-y-auto">
          {items.map((a) => (
            <div key={a._id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800 flex items-center gap-2">
                    {a.organizationId?.Name || "Organization"}
                    {a.status === "COMPLETED" && <Award size={14} className="text-green-600" />}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays size={12} />
                    <span>{a.dateTime ? new Date(a.dateTime).toLocaleDateString() : ""}</span>
                    <span>•</span>
                    <span>{a.dateTime ? new Date(a.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {a.status === 'COMPLETED' && (
                    <button
                      onClick={() => generateInvoice(a, user)}
                      className="text-xs text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                      title="Download Certificate"
                    >
                      <Download size={14} /> Certificate
                    </button>
                  )}
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge(a.status)}`}>
                      {a.status}
                    </span>
                    {a.unitsCollected && (
                      <p className="text-xs text-gray-500 mt-1">{a.unitsCollected} Units</p>
                    )}
                  </div>
                </div>
              </div>
              {a.status !== "COMPLETED" && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Clock3 size={12} />
                  <span>Awaiting completion.</span>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              No records found matching filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryList;

