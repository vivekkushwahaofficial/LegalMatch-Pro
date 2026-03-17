import React, { useEffect, useState } from "react";
import axios from "axios";

const LawyerDirectory = () => {

  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");

  useEffect(() => {
    fetchLawyers();
  }, []);

  // Fetch lawyers from backend
  const fetchLawyers = async () => {
    try {

      const response = await axios.get(
        "http://localhost:8080/api/directory/lawyers",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setLawyers(response.data);

    } catch (error) {

      console.log("Lawyer API not ready");

    }
  };

  // Filter logic
  const filtered = lawyers.filter((lawyer) =>
    lawyer.name.toLowerCase().includes(search.toLowerCase()) &&
    lawyer.location.toLowerCase().includes(location.toLowerCase()) &&
    lawyer.expertise.toLowerCase().includes(expertise.toLowerCase())
  );

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Lawyer Directory
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">

        <input
          type="text"
          placeholder="Search by name"
          className="border px-3 py-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setExpertise(e.target.value)}
        >
          <option value="">All Expertise</option>
          <option value="Criminal">Criminal</option>
          <option value="Family">Family</option>
          <option value="Property">Property</option>
          <option value="Corporate">Corporate</option>
        </select>

        <input
          type="text"
          placeholder="Filter by location"
          className="border px-3 py-2 rounded"
          onChange={(e) => setLocation(e.target.value)}
        />

      </div>

      {/* Lawyer List */}

      {filtered.map((lawyer) => (

        <div
          key={lawyer.id}
          className="bg-white p-5 shadow rounded-lg mb-4 border"
        >

          <h3 className="text-lg font-semibold">
            {lawyer.name}
          </h3>

          <p className="text-gray-600">
            Expertise: {lawyer.expertise}
          </p>

          <p className="text-gray-600">
            Location: {lawyer.location}
          </p>

          <p
            className={`text-sm font-medium ${
              lawyer.verified ? "text-green-600" : "text-red-500"
            }`}
          >
            {lawyer.verified ? "Verified Lawyer" : "Not Verified"}
          </p>

        </div>

      ))}

    </div>

  );
};

export default LawyerDirectory;