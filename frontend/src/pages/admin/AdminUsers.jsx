import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Existing admin users endpoint.
      const data = await apiCall("/admin/users", "GET");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleActivate = async (id) => {
    try {
      // Uses existing admin approve action.
      await apiCall(`/admin/approve/${id}`, "PUT");
      await loadUsers();
    } catch (error) {
      console.error("Failed to activate user", error);
      alert("Unable to activate user");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      // Uses existing admin reject action as status downgrade.
      await apiCall(`/admin/reject/${id}`, "PUT");
      await loadUsers();
    } catch (error) {
      console.error("Failed to deactivate user", error);
      alert("Unable to deactivate user");
    }
  };

  const handleBlock = async (id) => {
    try {
      // Reuses existing endpoint to keep API compatibility.
      await apiCall(`/admin/reject/${id}`, "PUT");
      await loadUsers();
    } catch (error) {
      console.error("Failed to block user", error);
      alert("Unable to block user");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage user status and account lifecycle.</p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 border-b border-slate-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="px-4 py-3 text-slate-900 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600">{user.role}</td>
                  <td className="px-4 py-3 text-slate-600">{user.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => handleActivate(user.id)} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                        Activate
                      </button>
                      <button onClick={() => handleDeactivate(user.id)} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700">
                        Deactivate
                      </button>
                      <button onClick={() => handleBlock(user.id)} className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700">
                        Block
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
