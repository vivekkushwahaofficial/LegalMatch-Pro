import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";

const CaseList = () => {

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await apiCall("/cases/my", "GET");
      setCases(response);
    } catch (error) {
      console.log("Error fetching cases");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading cases...</p>;
  }

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">My Cases</h1>

      {cases.length === 0 ? (
        <p className="text-gray-500">No cases found.</p>
      ) : (
        cases.map((c) => (

          <div
            key={c.id}
            onClick={() => navigate(`/citizen/case/${c.id}`)}
            className="bg-white shadow p-4 mb-3 rounded cursor-pointer hover:bg-gray-50"
          >

            <h3 className="font-semibold">{c.title}</h3>

            <p className="text-sm text-gray-500">
              Category: {c.category}
            </p>

            <p className="text-sm text-gray-500">
              Status: {c.status}
            </p>

          </div>

        ))
      )}

    </div>
  );
};

export default CaseList;