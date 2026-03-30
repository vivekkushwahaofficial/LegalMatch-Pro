import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

const AdminCases = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCases = async () => {
    try {
      setLoading(true);
      setError("");
      // Use existing admin-capable cases endpoint.
      const data = await apiCall("/cases/all", "GET");
      setCases(Array.isArray(data) ? data : []);
    } catch (_) {
      setCases([]);
      setError("Case data is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Monitoring</h1>
        <p className="text-slate-500 mt-1">Monitor case progress and assignment visibility.</p>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Case Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Lawyer</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>Loading cases...</td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>No cases found.</td>
              </tr>
            ) : (
              cases.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-900 font-medium">{item.title || item.caseTitle}</td>
                  <td className="px-4 py-3 text-slate-600">{item.status || "UNKNOWN"}</td>
                  <td className="px-4 py-3 text-slate-600">{item.assignedLawyer || item.lawyerName || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCases;
