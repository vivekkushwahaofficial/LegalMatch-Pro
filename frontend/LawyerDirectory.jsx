import React, { useEffect, useState } from "react";
import axios from "axios";

const LawyerDirectory = () => {
  const [lawyers, setLawyers] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/directory/lawyers",
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

  const filtered = lawyers.filter((lawyer) =>
    lawyer.name.toLowerCase().includes(search.toLowerCase()) &&
    lawyer.location.toLowerCase().includes(location.toLowerCase())
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
        <input
          type="text"
          placeholder="Filter by location"
          className="border px-3 py-2 rounded"
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {filtered.map((lawyer) => (
        <div
          key={lawyer.id}
          className="bg-white p-4 shadow rounded mb-3"
        >
          <h3 className="font-semibold">{lawyer.name}</h3>
          <p>Expertise: {lawyer.expertise}</p>
          <p>Location: {lawyer.location}</p>
          <p>
            Verified:{" "}
            {lawyer.verified ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LawyerDirectory;