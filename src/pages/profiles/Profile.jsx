import { useState } from "react";


export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Dharshini",
    email: "dharshini6521@gmail.com",
    role: "Citizen",
    location: "Chennai",
    photo: "https://i.pravatar.cc/150?img=5"

  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated (frontend only)");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md">

      <h1 className="text-2xl font-semibold mb-6">Profile Management</h1>

      {/* Profile Image */}
      <div className="flex items-center gap-4 mb-6">
        <img
  src={user.photo}
  alt="profile"
  className="w-20 h-20 rounded-full"
/>
        <button className="px-3 py-1 bg-gray-200 rounded">
          Change Photo
        </button>
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



      {/* Buttons */}
      <div className="flex gap-3 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Profile
          </button>
        )}
      </div>

    </div>

  );
}