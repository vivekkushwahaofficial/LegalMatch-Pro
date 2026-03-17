import React, { useEffect, useState } from "react";
import axios from "axios";

const NgoDirectory = () => {

  const [ngos, setNgos] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [expertise, setExpertise] = useState("");

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {

      const response = await axios.get(
        "http://localhost:8080/api/directory/ngos",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setNgos(response.data);

    } catch (error) {

      console.log("NGO API not ready");

    }
  };

  // Filtering logic
  const filtered = ngos.filter((ngo) =>
    ngo.name.toLowerCase().includes(search.toLowerCase()) &&
    ngo.location.toLowerCase().includes(location.toLowerCase()) &&
    ngo.expertise.toLowerCase().includes(expertise.toLowerCase())
  );

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        NGO Directory
      </h1>

      {/* Filters */}

      <div className="flex gap-4 mb-6 flex-wrap">

        <input
          type="text"
          placeholder="Search NGO"
          className="border px-3 py-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setExpertise(e.target.value)}
        >
          <option value="">All Expertise</option>
          <option value="Legal Aid">Legal Aid</option>
          <option value="Women Rights">Women Rights</option>
          <option value="Child Protection">Child Protection</option>
          <option value="Human Rights">Human Rights</option>
        </select>

        <input
          type="text"
          placeholder="Filter by location"
          className="border px-3 py-2 rounded"
          onChange={(e) => setLocation(e.target.value)}
        />

      </div>

      {/* NGO List */}

      {filtered.map((ngo) => (

        <div
          key={ngo.id}
          className="bg-white p-5 shadow rounded-lg mb-4 border"
        >

          <h3 className="text-lg font-semibold">
            {ngo.name}
          </h3>

          <p className="text-gray-600">
            Expertise: {ngo.expertise}
          </p>

          <p className="text-gray-600">
            Location: {ngo.location}
          </p>

          <p
            className={`text-sm font-medium ${
              ngo.verified ? "text-green-600" : "text-red-500"
            }`}
          >
            {ngo.verified ? "Verified NGO" : "Not Verified"}
          </p>

        </div>

      ))}

    </div>

  );
};

export default NgoDirectory;