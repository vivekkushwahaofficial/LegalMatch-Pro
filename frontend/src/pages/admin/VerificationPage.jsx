import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

const VerificationPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadVerifications = async () => {
    try {
      setLoading(true);
      // Use existing admin users endpoint for verification queue data.
      const users = await apiCall("/admin/users", "GET");
      const mapped = (Array.isArray(users) ? users : []).filter(
        (u) => u.role === "LAWYER" || u.role === "NGO"
      );
      setRecords(mapped);
    } catch (error) {
      console.error("Failed to fetch verifications", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerifications();
  }, []);

  const approve = async (id) => {
    try {
      await apiCall(`/admin/approve/${id}`, "PUT");
      await loadVerifications();
    } catch (error) {
      console.error("Approval failed", error);
      alert("Unable to approve");
    }
  };

  const reject = async (id) => {
    try {
      await apiCall(`/admin/reject/${id}`, "PUT");
      await loadVerifications();
    } catch (error) {
      console.error("Rejection failed", error);
      alert("Unable to reject");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verification Center</h1>
        <p className="text-slate-500 mt-1">Review pending lawyer and NGO verification requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 text-slate-500">Loading verifications...</div>
        ) : records.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-5 text-slate-500">No verification requests found.</div>
        ) : (
          records.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
              {/* Basic applicant info card. */}
              <h2 className="font-semibold text-slate-900">{item.name || item.ngoName || "Applicant"}</h2>
              <p className="text-sm text-slate-600 mt-1">{item.email || "No email available"}</p>
              <p className="text-sm text-slate-600">Role: {item.role || "Unknown"}</p>
              <p className="text-sm text-slate-600">Status: {item.status || "PENDING"}</p>

              {/* Document placeholder section. */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-500">
                Documents: Not provided by current API payload.
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={() => approve(item.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                  Approve
                </button>
                <button onClick={() => reject(item.id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VerificationPage;
