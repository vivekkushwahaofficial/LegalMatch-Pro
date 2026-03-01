import React, { useState, useEffect } from "react";
import axios from "axios";

const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [cases, setCases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newCase, setNewCase] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch cases from backend
  const fetchCases = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/cases", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setCases(response.data);
    } catch (error) {
      console.log("Cases API not available yet");
      setCases([]);
    }
  };

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/notifications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.log("Notifications API not available yet");
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchNotifications();
  }, []);

  // Submit new case
  const handleSubmitCase = async () => {
    if (!newCase.trim()) return;

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:8080/api/cases",
        { title: newCase },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setNewCase("");
      fetchCases(); // refresh list
    } catch (error) {
      console.log("Submit case API not ready");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">Citizen Panel</h2>
        <ul className="space-y-4">
          <li onClick={() => setActiveTab("dashboard")} className="cursor-pointer hover:text-gray-300">
            Dashboard
          </li>
          <li onClick={() => setActiveTab("cases")} className="cursor-pointer hover:text-gray-300">
            My Cases
          </li>
          <li onClick={() => setActiveTab("notifications")} className="cursor-pointer hover:text-gray-300">
            Notifications
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Dashboard Overview */}
        {activeTab === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
            <div className="bg-white p-6 rounded shadow">
              <p>Total Cases: {cases.length}</p>
              <p>Total Notifications: {notifications.length}</p>
            </div>
          </div>
        )}

        {/* Cases Section */}
        {activeTab === "cases" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">My Cases</h1>

            <div className="bg-white p-6 rounded shadow mb-6">
              <input
                type="text"
                placeholder="Describe your legal issue..."
                value={newCase}
                onChange={(e) => setNewCase(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSubmitCase}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {loading ? "Submitting..." : "Submit Case"}
              </button>
            </div>

            <div className="space-y-3">
              {cases.length === 0 ? (
                <p className="text-gray-500">No cases found.</p>
              ) : (
                cases.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded shadow flex justify-between">
                    <span>{c.title}</span>
                    <span className="text-sm bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeTab === "notifications" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Notifications</h1>
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications available.</p>
            ) : (
              notifications.map((n, index) => (
                <div key={index} className="bg-white p-4 rounded shadow mb-3">
                  {n.message}
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CitizenDashboard;