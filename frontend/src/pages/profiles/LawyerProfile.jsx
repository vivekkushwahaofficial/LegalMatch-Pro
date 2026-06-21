import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../../api/apiConfig";
import { ShieldCheck, MapPin, Scale, Pencil, Save, X } from "lucide-react";

const LawyerProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    location: "",
    licenseNumber: "",
  });
  const isReadonlyView = Boolean(id);

  const fetchProfile = async () => {
    const normalizedId = String(id || "").trim();
    if (id && (!normalizedId || normalizedId === "undefined" || normalizedId === "null")) {
      setError("Invalid profile ID.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = id ? `/lawyers/${normalizedId}` : "/profile/me";
      const data = await apiCall(endpoint, "GET");
      setProfile(data);
      setForm({
        name: data.name || "",
        specialization: data.specialization || "",
        location: data.location || "",
        licenseNumber: data.licenseNumber || "",
      });
    } catch (err) {
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await apiCall("/profile/update", "PUT", form);
      setProfile(updated);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: profile.name || "",
      specialization: profile.specialization || "",
      location: profile.location || "",
      licenseNumber: profile.licenseNumber || "",
    });
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <Scale size={36} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.name}
              </h1>
              <p className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mt-1">
                {profile?.specialization || "Lawyer"}
              </p>
              {profile?.verified && (
                <div className="flex items-center gap-1.5 mt-2 text-green-700 text-xs font-bold">
                  <ShieldCheck size={14} /> Verified Professional
                </div>
              )}
            </div>
          </div>
          {!editing && !isReadonlyView && (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-semibold text-sm hover:bg-indigo-100 transition-all"
            >
              <Pencil size={15} /> Edit Profile
            </button>
          )}
        </div>

        {/* Success / Error */}
        {success && (
          <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Fields */}
        <div className="space-y-5">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Full Name</label>
            {editing ? (
              <input
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-400 outline-none transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium px-1">{profile?.name || "—"}</p>
            )}
          </div>

          {/* Email (read only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Email</label>
            <p className="text-gray-900 font-medium px-1">{profile?.email || "—"}</p>
          </div>

          {/* Specialization */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">Specialization</label>
            {editing ? (
              <input
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-400 outline-none transition-all"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium px-1">{profile?.specialization || "—"}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">
              <span className="flex items-center gap-1"><MapPin size={13} /> Location</span>
            </label>
            {editing ? (
              <input
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-400 outline-none transition-all"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium px-1">{profile?.location || "—"}</p>
            )}
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-500 mb-1">License Number</label>
            {editing ? (
              <input
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-indigo-400 outline-none transition-all"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
              />
            ) : (
              <p className="text-gray-900 font-medium px-1">{profile?.licenseNumber || "—"}</p>
            )}
          </div>

        </div>

        {/* Save / Cancel buttons */}
        {editing && (
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-all disabled:opacity-60"
            >
              <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default LawyerProfile;
