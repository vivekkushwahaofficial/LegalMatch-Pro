import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

const SystemLogs = () => {
  const [errorLogs, setErrorLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError("");
      // System logs endpoint requested by admin UI spec.
      const data = await apiCall("/admin/system/logs", "GET");
      // Debug safety: confirm API payload shape while integrating.
      console.log("System logs API response:", data);

      // Backend returns grouped logs object: { errorLogs: [], activityLogs: [] }
      setErrorLogs(Array.isArray(data?.errorLogs) ? data.errorLogs : []);
      setActivityLogs(Array.isArray(data?.activityLogs) ? data.activityLogs : []);
    } catch (err) {
      console.error("Failed to fetch system logs", err);
      setErrorLogs([]);
      setActivityLogs([]);
      setError("System logs endpoint is not currently available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System Monitoring</h1>
        <p className="text-slate-500 mt-1">Track error and activity logs.</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Error logs list. */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-900 mb-3">Error Logs</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : errorLogs.length === 0 ? (
            <p className="text-sm text-slate-500">No error logs available.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {errorLogs.map((log, index) => (
                <li key={log.id || index} className="p-2 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
                  {/* Use backend log.message and optional createdAt timestamp. */}
                  <p>{log.message || "Error log entry"}</p>
                  {log.createdAt && <p className="text-xs mt-1 opacity-80">{new Date(log.createdAt).toLocaleString()}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Activity logs list. */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4">
          <h2 className="font-semibold text-slate-900 mb-3">Activity Logs</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading...</p>
          ) : activityLogs.length === 0 ? (
            <p className="text-sm text-slate-500">No activity logs available.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {activityLogs.map((log, index) => (
                <li key={log.id || index} className="p-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-100">
                  {/* Use backend log.message and optional createdAt timestamp. */}
                  <p>{log.message || "Activity log entry"}</p>
                  {log.createdAt && <p className="text-xs mt-1 opacity-80">{new Date(log.createdAt).toLocaleString()}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
