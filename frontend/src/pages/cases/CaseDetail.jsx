import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";

export default function CaseDetail() {

  const { id } = useParams();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCase();
  }, [id]);

  const fetchCase = async () => {
    try {
      const response = await apiCall(`/cases/${id}`, "GET");
      setCaseData(response);
    } catch (error) {
      console.log("Error fetching case");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="p-6">Loading case details...</p>;
  }

  if (!caseData) {
    return <p className="p-6 text-red-500">Case not found</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        Case Details
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-3">

        <h2 className="text-xl font-semibold">
          {caseData.title}
        </h2>

        <p className="text-gray-600">
          {caseData.description}
        </p>

        <p>
          <span className="font-medium">Category:</span> {caseData.category}
        </p>

        <p>
          <span className="font-medium">Location:</span> {caseData.location}
        </p>

        <p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span className={`px-2 py-1 rounded text-sm ${caseData.status === "SUBMITTED"
                ? "bg-yellow-100 text-yellow-700"
                : caseData.status === "MATCHED"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
              {caseData.status}
            </span>
          </p>        </p>

        <p>
          <span className="font-medium">Created:</span>{" "}
          {new Date(caseData.createdAt).toLocaleDateString()}
        </p>

      </div>

    </div>
  );
}