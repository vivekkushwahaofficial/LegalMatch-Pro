import { useState } from "react";
import { Link } from "react-router-dom";

export default function NGODashboard() {

  const [cases, setCases] = useState([
    {
      id: 1,
      title: "Domestic Violence Case",
      description: "Need legal and social support",
      status: "Pending"
    },
    {
      id: 2,
      title: "Child Labor Issue",
      description: "Urgent NGO intervention required",
      status: "Pending"
    }
  ]);

  const handleAccept = (id) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "Accepted" } : c
      )
    );
  };

  const handleReject = (id) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id ? { ...c, status: "Rejected" } : c
      )
    );
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
        <p>No assigned cases</p>
      ) : (
        <div className="grid grid-cols-2 gap-6">

          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600 mb-3">
                {c.description}
              </p>

              <p className="mb-3">
                Status: <b>{c.status}</b>
              </p>

              <div className="flex gap-2">
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={() => handleAccept(c.id)}
                    className="flex-1 bg-green-500 text-white py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => handleReject(c.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Reject
                  </button>
                </div>

                <button
                  onClick={() => alert(c.description)}
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