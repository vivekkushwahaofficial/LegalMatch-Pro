import CaseCard from "../../components/cases/CaseCard";
import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import { Briefcase, MapPin, Tag } from "lucide-react";

export default function AssignedCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignedCases = async () => {
      try {
        const matches = await apiCall("/matches/my", "GET");
        const list = Array.isArray(matches) ? matches : [];
        // Only show accepted matches as active cases
        const accepted = list.filter(
          (m) => String(m.matchStatus || "").toUpperCase() === "ACCEPTED"
        );
        setCases(accepted);
      } catch (error) {
        console.error("Failed to fetch assigned cases", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignedCases();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Briefcase size={24} className="text-indigo-600" />
        Assigned Cases
      </h1>

      {cases.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <Briefcase size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No assigned cases yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Accepted case requests will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item) => (
            <div
              key={item.matchId}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Briefcase size={20} className="text-indigo-600" />
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  ACTIVE
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.caseTitle || "Untitled Case"}
              </h3>

              <p className="text-sm text-gray-500 mb-4">
                {item.caseDescription || "No description available."}
              </p>

              <div className="space-y-2">
                {item.caseCategory && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Tag size={14} className="text-gray-400" />
                    {item.caseCategory}
                  </div>
                )}
                {item.matchedUserName && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-gray-400" />
                    Client: {item.matchedUserName}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
