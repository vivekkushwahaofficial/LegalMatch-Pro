import { useState, useEffect } from 'react';
import { apiCall } from '../../api/apiConfig';
import {
  Users,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import ImpactDashboard from '../../components/dashboard/ImpactDashboard';
import DirectoryIngestion from '../../components/dashboard/DirectoryIngestion';
import AppSettings from '../../components/dashboard/AppSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('userVerification');

  // Mock data for the table
  const [verificationQueue, setVerificationQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  // fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await apiCall("/admin/users", "GET");

      // handle different backend responses
      setVerificationQueue(response.data || response || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };
  // approve user
  const approveUser = async (id) => {
    try {
      await apiCall(`/admin/approve/${id}`, "PUT");
      fetchUsers(); // reload users
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  // reject user
  const rejectUser = async (id) => {
    try {
      await apiCall(`/admin/reject/${id}`, "PUT");
      fetchUsers();
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };
  // run when page loads
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Panel</h2>
        <p className="text-slate-500 mt-1">Manage platform users, data ingestion, system health, and application settings.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 shrink-0 ${activeTab === 'userVerification' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('userVerification')}
        >
          User Verification
        </button>
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 shrink-0 ${activeTab === 'directory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('directory')}
        >
          Directory Ingestion
        </button>
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 shrink-0 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('logs')}
        >
          System Logs
        </button>
        <button
          className={`pb-4 px-6 text-sm font-medium transition-colors border-b-2 shrink-0 ${activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('settings')}
        >
          App Settings
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'userVerification' && (
        <div className="bg-white rounded-lg border border-slate-100 shadow-sm">
          {/* Access Control / Search Bar */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50">
            <div>
              <h3 className="font-semibold text-slate-900">User Verification Queue</h3>
              <p className="text-sm text-slate-500 mt-1">Review and approve/reject profiles for Lawyers and NGOs.</p>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search users..."
                className="pl-4 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">

                {loading ? (

                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      Loading users...
                    </td>
                  </tr>

                ) : verificationQueue.length === 0 ? (

                  <tr>
                    <td colSpan="6" className="text-center py-8 text-slate-400">
                      No users pending verification
                    </td>
                  </tr>

                ) : (

                  verificationQueue.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">

                      <td className="px-6 py-4 font-medium text-slate-900">
                        {user.name}
                      </td>

                      <td className="px-6 py-4">
                        {user.role}
                      </td>

                      <td className="px-6 py-4">
                        {user.email}
                      </td>

                      <td className="px-6 py-4">
                        {user.submittedDate}
                      </td>

                      <td className="px-6 py-4">

                        {user.status === "PENDING" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                            <Clock size={12} /> Pending
                          </span>
                        )}

                        {user.status === "APPROVED" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            <CheckCircle size={12} /> Approved
                          </span>
                        )}

                        {user.status === "REJECTED" && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <XCircle size={12} /> Rejected
                          </span>
                        )}

                      </td>

                      <td className="px-6 py-4 text-right">

                        {user.status === "PENDING" ? (

                          <div className="flex justify-end gap-2">

                            <button
                              onClick={() => approveUser(user.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800"
                            >
                              <CheckCircle size={14} /> Approve
                            </button>

                            <button
                              onClick={() => rejectUser(user.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-md text-xs font-medium hover:bg-red-600"
                            >
                              <XCircle size={14} /> Reject
                            </button>

                          </div>

                        ) : (

                          <button className="text-slate-400 text-xs font-medium">
                            View Details
                          </button>

                        )}

                      </td>

                    </tr>
                  ))

                )}

              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'directory' && (
        <DirectoryIngestion />
      )}

      {activeTab === 'logs' && (
        <ImpactDashboard />
      )}

      {activeTab === 'settings' && (
        <AppSettings />
      )}
    </div>
  );
};

export default AdminDashboard;
