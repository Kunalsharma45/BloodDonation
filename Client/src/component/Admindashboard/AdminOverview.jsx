import { useNavigate } from "react-router-dom";
import Analytics from "../DonorDashboard/Analytics"; // Reusing chart component
import StatsView from "./StatsView";
import AlertsView from "./AlertsView";
import PendingQueue from "./PendingQueue";

const AdminOverview = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <StatsView />

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Platform Growth (Donations)
        </h3>
        <Analytics />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => navigate("/admin/notifications")}
          className="w-full bg-red-50 border border-red-100 rounded-xl p-4 text-left hover:border-red-200 hover:bg-red-100 transition"
        >
          <p className="text-sm text-gray-600">Quick Action</p>
          <p className="text-lg font-semibold text-gray-800">Send Broadcast</p>
          <p className="text-xs text-gray-500 mt-1">
            Notify donors or orgs instantly.
          </p>
        </button>
        <button
          onClick={() => navigate("/admin/logs")}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-left hover:border-gray-200 transition"
        >
          <p className="text-sm text-gray-600">Quick Action</p>
          <p className="text-lg font-semibold text-gray-800">View Audit Logs</p>
          <p className="text-xs text-gray-500 mt-1">
            Review recent admin actions.
          </p>
        </button>
        <button
          onClick={() => navigate("/admin/alerts")}
          className="w-full bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-gray-200 transition"
        >
          <p className="text-sm text-gray-600">Quick Action</p>
          <p className="text-lg font-semibold text-gray-800">Critical Alerts</p>
          <p className="text-xs text-gray-500 mt-1">
            Jump to system alerts dashboard.
          </p>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsView />
        <PendingQueue />
      </div>
    </div>
  );
};

export default AdminOverview;
