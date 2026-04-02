import { useState, useEffect, useMemo } from "react";
import { apiCall } from "../../api/apiConfig";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";
import { Loader2, SearchX } from "lucide-react";

export default function Matching() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [specialization, setSpecialization] = useState([]);
  const [page, setPage] = useState(1);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchMatches = async () => {
    const params = new URLSearchParams();
    if (role !== "ALL") {
      params.set("role", role);
    }
    if (specialization.length > 0) {
      params.set("specialization", specialization.join(","));
    }
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    const query = params.toString();
    const endpoint = query ? `/matches/my?${query}` : "/matches/my";

    try {
      setLoading(true);
      setError("");
      const data = await apiCall(endpoint, "GET");
      const rows = Array.isArray(data) ? data : [];

      const mappedProfiles = rows.map((m) => ({
        id: m.matchId,
        providerId: m.providerId || m.matchedUserId,
        providerType: m.providerType || m.matchedUserRole,
        name: m.matchedUserName,
        role: m.matchedUserRole,
        specialization: m.specialization,
        score: Number(m.score || m.matchScore || 0),
        status: m.matchStatus,
      }));

      setProfiles(mappedProfiles);
    } catch (fetchError) {
      console.error("Error fetching matches:", fetchError);
      setProfiles([]);
      setError("Unable to load matches right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, [role, specialization, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [role, specialization, debouncedSearch]);

  const toggleSpecialization = (value) => {
    setSpecialization((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setRole("ALL");
    setSpecialization([]);
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const filteredProfiles = useMemo(() => {
    const term = debouncedSearch.toLowerCase();

    return profiles
      .filter((profile) => (role === "ALL" ? true : String(profile.role || "").toUpperCase() === role))
      .filter((profile) => {
        if (specialization.length === 0) {
          return true;
        }
        const text = String(profile.specialization || "").toLowerCase();
        return specialization.some((spec) => text.includes(spec.toLowerCase()));
      })
      .filter((profile) => {
        if (!term) {
          return true;
        }
        const haystack = [
          profile.name,
          profile.specialization,
          profile.role,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
  }, [profiles, role, specialization, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pagedProfiles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredProfiles.slice(start, start + pageSize);
  }, [filteredProfiles, page]);

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

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="w-full lg:w-80 lg:shrink-0">
          <Filters
            role={role}
            setRole={setRole}
            specializations={specialization}
            onToggleSpecialization={toggleSpecialization}
            search={search}
            setSearch={setSearch}
            onClearFilters={clearAllFilters}
            loading={loading}
          />
        </aside>

        <main className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finding Your Legal Match</h1>
            <p className="text-gray-500 font-medium">Review matched legal providers, then accept or reject suggestions.</p>
          </div>

          <div className="mb-4 text-sm text-gray-600" aria-live="polite">
            {loading
              ? "Refreshing matches..."
              : `Showing ${filteredProfiles.length} result${filteredProfiles.length === 1 ? "" : "s"}`}
          </div>

          {loading && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex items-center justify-center gap-3 mb-6">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-700">Loading matches...</p>
            </div>
          )}

          {!loading && error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && pagedProfiles.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX className="w-10 h-10 text-blue-400" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No results found</h2>
              <p className="text-gray-500 max-w-xs mx-auto">Try adjusting your role, specialization, or search filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {pagedProfiles.map((profile) => (
                  <MatchCard
                    key={profile.id}
                    profile={profile}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))}
              </div>

              {!loading && filteredProfiles.length > pageSize && (
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600" aria-live="polite">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
