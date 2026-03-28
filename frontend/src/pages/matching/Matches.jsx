import { useState, useEffect } from "react";
import { apiCall } from "../../api/apiConfig";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";
import { Send } from "lucide-react";

export default function Matching() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [specialization, setSpecialization] = useState("All");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/matches/my", "GET");
      const rows = Array.isArray(data) ? data : [];

      const mappedProfiles = rows.map((m) => ({
        id: m.matchId,
        name: m.matchedUserName,
        role: m.matchedUserRole,
        specialization: m.specialization,
        score: Number(m.score || m.matchScore || 0),
        status: m.matchStatus,
      }));

      setProfiles(mappedProfiles);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (profile) => {
    try {
      await apiCall(`/matches/${profile.id}/accept`, "PUT");
      await fetchMatches();
      alert("Match accepted successfully!");
    } catch (error) {
      alert("Failed to accept match.");
    }
  };

  const handleReject = async (profile) => {
    try {
      await apiCall(`/matches/${profile.id}/reject`, "PUT");
      await fetchMatches();
    } catch (error) {
      alert("Failed to reject match.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64">
          <Filters setRole={setRole} setSpecialization={setSpecialization} />
        </aside>

        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finding Your Legal Match</h1>
            <p className="text-gray-500 font-medium">Review matched legal providers, then accept or reject suggestions.</p>
          </div>

          <div className="relative mb-8 group">
            <input
              type="text"
              placeholder="Search by name, expertise, or mission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl p-4 pl-12 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {profiles.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h2>
              <p className="text-gray-500 max-w-xs mx-auto">Submit a case to start finding the right legal support for your needs.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles
                .filter((profile) => profile.name?.toLowerCase().includes(search.toLowerCase()))
                .filter((profile) => (role === "All" ? true : profile.role === role.toUpperCase()))
                .filter((profile) =>
                  specialization === "All" ? true : String(profile.specialization || "").includes(specialization)
                )
                .map((profile) => (
                  <MatchCard
                    key={profile.id}
                    profile={profile}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
