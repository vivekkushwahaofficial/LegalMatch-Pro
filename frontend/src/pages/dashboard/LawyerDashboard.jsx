import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

const LawyerDashboard = () => {
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    try {
      const data = await apiCall("/matches/my", "GET");
      const list = Array.isArray(data) ? data : [];
      setRequests(list.filter((m) => String(m.matchStatus || "").toUpperCase() === "REQUESTED"));
    } catch (error) {
      console.error("Failed to load lawyer requests", error);
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const actOnRequest = async (matchId, approved) => {
    try {
      const endpoint = approved ? `/matches/${matchId}/accept` : `/matches/${matchId}/reject`;
      await apiCall(endpoint, "PUT");
      await loadRequests();
    } catch (error) {
      console.error("Failed to update request", error);
      alert("Unable to update request");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lawyer Dashboard</h1>
      <p>Welcome to the Lawyer Dashboard.</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg">My Active Cases</h3>
          <p className="text-3xl font-bold mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg">New Inquiries</h3>
          <p className="text-3xl font-bold mt-2">5</p>
        </div>
        <Link to="/lawyer/requests" className="bg-blue-600 p-6 rounded-xl shadow-md border border-blue-700 text-white hover:bg-blue-700 transition-all">
          <h3 className="font-bold text-lg">Connection Requests</h3>
          <p className="text-sm opacity-90 mt-2">Review and approve new chat requests from clients.</p>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Assigned Case Requests</h2>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500">No pending assignments.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.matchId} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{req.caseTitle}</p>
                  <p className="text-sm text-gray-600">Citizen request from {req.matchedUserName ? "client" : "case owner"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => actOnRequest(req.matchId, true)} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm">Accept</button>
                  <button onClick={() => actOnRequest(req.matchId, false)} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerDashboard;
