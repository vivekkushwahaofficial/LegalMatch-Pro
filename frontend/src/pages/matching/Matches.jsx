import { useState, useEffect } from "react";
import axios from "axios";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";

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
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:8080/api/matches/my", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map MatchResponse to frontend profile structure
      const mappedProfiles = response.data.map(m => ({
        id: m.matchId,
        name: m.matchedUserName,
        role: m.matchedUserRole,
        specialization: m.specialization,
        score: m.score,
        status: m.matchStatus
      }));
      
      // Only show PENDING matches
      setProfiles(mappedProfiles.filter(p => p.status === "PENDING"));
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (profile) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`http://localhost:8080/api/matches/${profile.id}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(prev => prev.filter(p => p.id !== profile.id));
      alert("Match accepted!");
    } catch (error) {
      console.error("Error accepting match:", error);
      alert("Failed to accept match.");
    }
  };

  const handleReject = async (profile) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`http://localhost:8080/api/matches/${profile.id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(prev => prev.filter(p => p.id !== profile.id));
      alert("Match rejected.");
    } catch (error) {
      console.error("Error rejecting match:", error);
      alert("Failed to reject match.");
    }
  };

  if (loading) {
    return <div className="text-center p-10">Loading matches...</div>;
  }

  return (
    <div className="flex gap-6">
      <Filters
        setRole={setRole}
        setSpecialization={setSpecialization}
      />

      <div className="flex-1">
        <h1 className="text-2xl font-semibold mb-6">
          Matching Profiles
        </h1>

        <input
          type="text"
          placeholder="Search lawyers or NGOs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-2 mb-6"
        />

        {profiles.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No pending matches found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles
              .filter(profile =>
                profile.name.toLowerCase().includes(search.toLowerCase())
              )
              .filter(profile =>
                role === "All" ? true : profile.role === role.toUpperCase()
              )
              .filter(profile =>
                specialization === "All"
                  ? true
                  : profile.specialization.includes(specialization)
              )
              .map(profile => (
                <MatchCard
                  key={profile.id}
                  profile={profile}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}