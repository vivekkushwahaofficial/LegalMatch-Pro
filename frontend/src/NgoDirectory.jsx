import React, { useEffect, useState } from "react";
import axios from "axios";

const NgoDirectory = () => {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/directory/ngos",
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        NGO Directory
      </h1>

      {ngos.map((ngo) => (
        <div
          key={ngo.id}
          className="bg-white p-4 shadow rounded mb-3"
        >
          <h3 className="font-semibold">{ngo.name}</h3>
          <p>Expertise: {ngo.expertise}</p>
          <p>Location: {ngo.location}</p>
          <p>
            Verified: {ngo.verified ? "Yes" : "No"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NgoDirectory;