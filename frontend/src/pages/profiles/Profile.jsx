import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../../api/apiConfig";
import InitialsAvatar from "../../components/shared/InitialsAvatar";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    location: "",
    specialization: "",
    profileImage: "",
    ngoName: "",
    registrationNumber: "",
    licenseNumber: "",
  });

  const isReadonlyView = Boolean(id);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const normalizedId = String(id || "").trim();
        if (id && (!normalizedId || normalizedId === "undefined" || normalizedId === "null")) {
          setError("Invalid profile ID");
          setLoading(false);
          return;
        }

        const endpoint = id ? `/ngos/${normalizedId}` : "/profile/me";
        const profile = await apiCall(endpoint, "GET");
        setUser({
          id: profile?.id || "",
          name: profile?.name || "",
          email: profile?.email || "",
          role: profile?.role || "",
          location: profile?.location || "",
          specialization: profile?.specialization || "",
          profileImage: profile?.profileImage || "",
          ngoName: profile?.ngoName || "",
          registrationNumber: profile?.registrationNumber || "",
          licenseNumber: profile?.licenseNumber || "",
        });
      } catch (err) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const roleUpper = useMemo(() => String(user.role || "").toUpperCase(), [user.role]);
  const isLawyer = roleUpper === "LAWYER";
  const isNgo = roleUpper === "NGO";

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        name: user.name,
        location: user.location,
        specialization: user.specialization,
        ngoName: user.ngoName,
        registrationNumber: user.registrationNumber,
        licenseNumber: user.licenseNumber,
      };

      const updated = await apiCall("/profile/update", "PUT", payload);
      setUser((prev) => ({
        ...prev,
        id: updated?.id || prev.id,
        name: updated?.name || prev.name,
        email: updated?.email || prev.email,
        role: updated?.role || prev.role,
        location: updated?.location || prev.location,
        specialization: updated?.specialization || prev.specialization,
        profileImage: updated?.profileImage || prev.profileImage,
        ngoName: updated?.ngoName || prev.ngoName,
        registrationNumber: updated?.registrationNumber || prev.registrationNumber,
        licenseNumber: updated?.licenseNumber || prev.licenseNumber,
      }));

      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-md">

      <h1 className="text-2xl font-semibold mb-6">Profile Management</h1>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex items-center gap-4 mb-6">
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <InitialsAvatar name={user.name || user.email} size={80} className="bg-slate-200 text-slate-700" textClassName="text-lg" />
        )}
        {!isReadonlyView && <button className="px-3 py-1 bg-gray-200 rounded">Change Photo</button>}
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="text"
          value={user.email}
          disabled
          className="w-full border p-2 rounded mt-1 bg-gray-100"
        />
      </div>

      {/* Role */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Role</label>
        <input
          type="text"
          value={user.role}
          disabled
          className="w-full border p-2 rounded mt-1 bg-gray-100"
        />
      </div>

      {/* Location */}
      <div className="mb-4">
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          name="location"
          value={user.location}
          onChange={handleChange}
          disabled={!isEditing}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {(isLawyer || isNgo) && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Specialization</label>
          <select
            name="specialization"
            value={user.specialization}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="">Select specialization</option>
            <option value="Family Law">Family Law</option>
            <option value="Criminal Law">Criminal Law</option>
            <option value="Civil Law">Civil Law</option>
            <option value="Corporate Law">Corporate Law</option>
            <option value="Property Law">Property Law</option>
            <option value="Immigration Law">Immigration Law</option>
            <option value="Labor Law">Labor Law</option>
            <option value="Constitutional Law">Constitutional Law</option>
            <option value="Tax Law">Tax Law</option>
            <option value="Human Rights Law">Human Rights Law</option>
          </select>
        </div>
      )}

      {isLawyer && (
        <div className="mb-4">
          <label className="block text-sm font-medium">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={user.licenseNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full border p-2 rounded mt-1"
          />
        </div>
      )}

      {isNgo && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium">NGO Name</label>
            <input
              type="text"
              name="ngoName"
              value={user.ngoName}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mt-1"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Registration Number</label>
            <input
              type="text"
              name="registrationNumber"
              value={user.registrationNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full border p-2 rounded mt-1"
            />
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isReadonlyView}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isReadonlyView ? "Read Only" : "Edit Profile"}
          </button>
        )}
      </div>

    </div>
  );
}