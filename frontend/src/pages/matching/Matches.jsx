import { useState } from "react";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";

export default function Matching() {
    const [search, setSearch] = useState("");

  const profiles = [
    {
      id: 1,
      name: "Dr. Anya Sharma",
      role: "Lawyer",
      score: 92,
      specialization: "Family Law • Child Custody"
    },
    {
      id: 2,
      name: "Legal Rights Foundation",
      role: "NGO",
      score: 80,
      specialization: "Human Rights"
    },
    {
      id: 3,
      name: "Marcus Chen",
      role: "Lawyer",
      score: 85,
      specialization: "Property Disputes"
    },
    {
      id: 4,
      name: "Justice Advocates Collective",
      role: "NGO",
      score: 90,
      specialization: "Criminal Defense"
    }
  ];

  return (
    <div className="flex gap-6">

      <Filters />

      <div className="flex-1">

        <h1 className="text-2xl font-semibold mb-6">
          Matching Profiles
        </h1>

        <div className="grid grid-cols-3 gap-6">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search lawyers or NGOs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
            {profiles
              .filter((profile) =>
                profile.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((profile) => (
                <MatchCard key={profile.id} profile={profile} />
            ))}
        </div>

      </div>

    </div>
  );
}