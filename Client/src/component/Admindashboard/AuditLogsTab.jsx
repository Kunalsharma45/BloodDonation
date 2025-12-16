import { useEffect, useState } from "react";
import client from "../../api/client";
import { toast } from "sonner";

const AuditLogsTab = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [action, setAction] = useState("");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (action) params.action = action;
      const res = await client.get("/api/admin/logs", { params });
      setLogs(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, action]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Audit Logs</h2>
          <p className="text-sm text-gray-500">Recent admin actions</p>
        </div>
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          className="text-sm border rounded-lg px-3 py-2"
        >
          <option value="">All actions</option>
          <option value="USER_VERIFY">User Verify</option>
          <option value="USER_BLOCK">User Block</option>
          <option value="PROFILE_UPDATE_ACTION">Profile Update</option>
          <option value="BROADCAST">Broadcast</option>
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading logs...</div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log._id} className="border rounded-lg p-3 flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                <p className="text-xs text-gray-500">
                  By {log.adminId?.Name || "Admin"} • {new Date(log.createdAt).toLocaleString()}
                </p>
                <pre className="text-xs bg-gray-50 border rounded p-2 mt-2 text-gray-700 overflow-auto">
                  {JSON.stringify(log.details || {}, null, 2)}
                </pre>
              </div>
              {log.targetType && (
                <span className="text-[11px] px-2 py-1 rounded bg-gray-100 text-gray-700">
                  {log.targetType}
                </span>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-sm text-gray-500">No logs found.</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => (logs.length < 20 ? p : p + 1))}
          disabled={logs.length < 20}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AuditLogsTab;

