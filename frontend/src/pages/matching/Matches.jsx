import { useState } from "react";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";

export default function Matching() {

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [specialization, setSpecialization] = useState("All");

  const [profiles, setProfiles] = useState([
    { id: 1, name: "Dr. Anya Sharma", role: "Lawyer", score: 92, specialization: "Family Law" },
    { id: 2, name: "Legal Rights Foundation", role: "NGO", score: 80, specialization: "Human Rights" },
    { id: 3, name: "Marcus Chen", role: "Lawyer", score: 85, specialization: "Property" },
    { id: 4, name: "Justice Advocates Collective", role: "NGO", score: 90, specialization: "Criminal" }
  ]);

  // Accept / Reject
  const handleAccept = (profile) => {
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
    console.log("Accepted:", profile);
  };

  const handleReject = (profile) => {
    setProfiles(prev => prev.filter(p => p.id !== profile.id));
    console.log("Rejected:", profile);
  };

  return (
    <div className="flex gap-6">

      {/* Filters */}
      <Filters
        setRole={setRole}
        setSpecialization={setSpecialization}
      />

      <div className="flex-1">

        <h1 className="text-2xl font-semibold mb-6">
          Matching Profiles
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search lawyers or NGOs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-2 mb-6"
        />

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">

          {profiles
            .filter(profile =>
              profile.name.toLowerCase().includes(search.toLowerCase())
            )
            .filter(profile =>
              role === "All" ? true : profile.role === role
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

      </div>
    </div>
  );
}