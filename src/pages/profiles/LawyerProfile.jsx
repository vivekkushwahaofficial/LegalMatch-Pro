import React from "react";

function LawyerProfile() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow rounded-lg">

      <div className="flex items-center gap-6 mb-6">

        <img
          src="https://i.pravatar.cc/150"
          alt="lawyer"
          className="w-24 h-24 rounded-full"
        />

        <div>
          <h1 className="text-2xl font-bold">Sarah Chen</h1>

          <p className="text-gray-600">Family Law Specialist</p>

          <p className="text-gray-500">Experience: 8 Years</p>

          <p className="text-green-600 font-semibold mt-2">
            Match Score: 92%
          </p>
        </div>

      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Practice Areas</h2>

        <div className="flex gap-2">
          <span className="border px-3 py-1 rounded">Family Law</span>
          <span className="border px-3 py-1 rounded">Child Custody</span>
          <span className="border px-3 py-1 rounded">Divorce</span>
        </div>
      </div>

      <div className="flex gap-4">

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Message
        </button>

        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Schedule Appointment
        </button>

      </div>

    </div>
  );
}

export default LawyerProfile;