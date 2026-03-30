import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import { Briefcase, MessageSquare, Calendar, UserCircle, Bell } from "lucide-react";

const LawyerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    activeCases: 0,
    pendingRequests: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("userName") || "Lawyer";

  const loadData = async () => {
    try {
      const matches = await apiCall("/matches/my", "GET");
      const list = Array.isArray(matches) ? matches : [];

      const pending = list.filter(
        (m) => String(m.matchStatus || "").toUpperCase() === "REQUESTED"
      );
      const active = list.filter(
        (m) => String(m.matchStatus || "").toUpperCase() === "ACCEPTED"
      );

      setRequests(pending);
      setStats((prev) => ({
        ...prev,
        activeCases: active.length,
        pendingRequests: pending.length,
      }));

      // load appointments count
      try {
        const appts = await apiCall("/appointments/my", "GET");
        const apptList = Array.isArray(appts) ? appts : [];
        setStats((prev) => ({ ...prev, appointments: apptList.length }));
      } catch (_) {}

    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const actOnRequest = async (matchId, approved) => {
    try {
      const endpoint = approved
        ? `/matches/${matchId}/accept`
        : `/matches/${matchId}/reject`;
      await apiCall(endpoint, "PUT");
      await loadData();
    } catch (error) {
      console.error("Failed to update request", error);
      alert("Unable to update request");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {name} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your cases today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-indigo-50 rounded-xl">
              <Briefcase size={20} className="text-indigo-600" />
            </div>
            <span className="text-gray-500 font-medium">Active Cases</span>
          </div>
          <p className="text-4xl font-black text-gray-900">
            {loading ? "—" : stats.activeCases}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-50 rounded-xl">
              <Bell size={20} className="text-yellow-600" />
            </div>
            <span className="text-gray-500 font-medium">Pending Requests</span>
          </div>
          <p className="text-4xl font-black text-gray-900">
            {loading ? "—" : stats.pendingRequests}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <Calendar size={20} className="text-green-600" />
            </div>
            <span className="text-gray-500 font-medium">Appointments</span>
          </div>
          <p className="text-4xl font-black text-gray-900">
            {loading ? "—" : stats.appointments}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/lawyer/chat"
          className="flex items-center gap-3 p-5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all"
        >
          <MessageSquare size={22} />
          <div>
            <p className="font-bold">Chat</p>
            <p className="text-xs opacity-80">Message your clients</p>
          </div>
        </Link>
        <Link
          to="/lawyer/appointments"
          className="flex items-center gap-3 p-5 bg-white border border-gray-100 text-gray-800 rounded-2xl hover:shadow-md transition-all"
        >
          <Calendar size={22} className="text-indigo-600" />
          <div>
            <p className="font-bold">Appointments</p>
            <p className="text-xs text-gray-500">View scheduled calls</p>
          </div>
        </Link>
        <Link
          to="/lawyer/profile"
          className="flex items-center gap-3 p-5 bg-white border border-gray-100 text-gray-800 rounded-2xl hover:shadow-md transition-all"
        >
          <UserCircle size={22} className="text-indigo-600" />
          <div>
            <p className="font-bold">My Profile</p>
            <p className="text-xs text-gray-500">View and edit your profile</p>
          </div>
        </Link>
      </div>

      {/* Pending Case Requests */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Pending Case Requests
        </h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">
            No pending case requests.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.matchId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="font-semibold text-gray-900">{req.caseTitle}</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    New case match request
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => actOnRequest(req.matchId, true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => actOnRequest(req.matchId, false)}
                    className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all"
                  >
                    Reject
                  </button>
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
