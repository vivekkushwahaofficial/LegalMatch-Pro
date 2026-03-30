import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiCall } from "../../api/apiConfig";

export default function NGODashboard() {

  const [cases, setCases] = useState([]);

  const loadCases = async () => {
    try {
      const data = await apiCall("/matches/my", "GET");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.matches)
            ? data.matches
            : [];

      // NGOs should be able to act on newly assigned matches before chat requests are sent.
      setCases(
        list.filter((m) => {
          const status = String(m.matchStatus || "").toUpperCase();
          return status === "PENDING" || status === "REQUESTED";
        })
      );
    } catch (error) {
      console.error("Failed to load NGO assignments", error);
      setCases([]);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleAccept = async (id) => {
    try {
      await apiCall(`/matches/${id}/accept`, "PUT");
      await loadCases();
    } catch (error) {
      alert("Unable to accept case");
    }
  };

  const handleReject = async (id) => {
    try {
      await apiCall(`/matches/${id}/reject`, "PUT");
      await loadCases();
    } catch (error) {
      alert("Unable to reject case");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        NGO Dashboard
      </h1>

      <Link to="/ngo/requests" className="block mb-8 bg-blue-600 p-6 rounded-xl shadow-md border border-blue-700 text-white hover:bg-blue-700 transition-all">
        <h3 className="font-bold text-lg">Communication Requests</h3>
        <p className="text-sm opacity-90 mt-2">Manage incoming chat requests from individuals seeking legal aid.</p>
      </Link>

      {cases.length === 0 ? (
        <p>No pending case requests right now.</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">

          {cases.map((c) => (
            <div
              key={c.matchId}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h3 className="font-semibold">{c.caseTitle}</h3>
              <p className="text-sm text-gray-600 mb-3">
                Support request awaiting your decision.
              </p>

              <p className="mb-3">
                Status: <b>{c.matchStatus}</b>
              </p>

              <div className="flex gap-2">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => handleAccept(c.matchId)}
                    className="flex-1 bg-green-500 text-white py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(c.matchId)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Reject
                  </button>
                </div>

                <button
                  onClick={() => alert(c.caseTitle)}
                  className="w-full bg-blue-500 text-white py-1 rounded"
                >
                  View Details
                </button>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}