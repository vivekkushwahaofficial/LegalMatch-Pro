import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CaseDetail = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    fetchCase();
  }, []);

  const fetchCase = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/cases/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCaseData(response.data);
    } catch (error) {
      console.log("Case detail API not ready");
    }
  };

  if (!caseData) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">
        {caseData.title}
      </h2>
      <p className="mb-2">
        <strong>Description:</strong> {caseData.description}
      </p>
      <p>
        <strong>Status:</strong> {caseData.status}
      </p>
      <p>
        <strong>Created At:</strong> {caseData.createdAt}
      </p>
    </div>
  );
};

export default CaseDetail;