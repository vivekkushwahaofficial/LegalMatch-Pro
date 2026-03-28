import { useState, useEffect } from "react";
import { apiCall } from "../../api/apiConfig";
import Filters from "../../components/matching/Filters";
import MatchCard from "../../components/matching/MatchCard";
import { Send, X, Paperclip } from "lucide-react";

export default function Matching() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [specialization, setSpecialization] = useState("All");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Request Modal State
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
  try {
    setLoading(true);
    const data = await apiCall("/matches/my", "GET");

    console.log("API RESPONSE:", data); // 🔥 ADD THIS

    const mappedProfiles = data.map(m => ({
      id: m.matchId,
      name: m.matchedUserName,
      role: m.matchedUserRole,
      specialization: m.specialization,
      score: m.score,
      status: m.matchStatus
    }));

    console.log("MAPPED PROFILES:", mappedProfiles); // 🔥 ADD THIS

    setProfiles(mappedProfiles);
  } catch (error) {
    console.error("Error fetching matches:", error);
  } finally {
    setLoading(false);
  }
};

  const handleSendRequest = async () => {
    try {
      await apiCall(`/matches/${selectedProfile.id}/request`, "POST", {
        message: requestMessage,
        attachmentUrl: attachmentUrl
      });
      
      setSelectedProfile(null);
      setRequestMessage("");
      setAttachmentUrl("");
      fetchMatches(); // Refresh to show "REQUESTED" status
      alert("Request sent successfully!");
    } catch (error) {
      alert("Failed to send request.");
    }
  };

  const handleReject = async (profile) => {
    try {
      await apiCall(`/matches/${profile.id}/reject`, "PUT");
      fetchMatches();
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
          <Filters
            setRole={setRole}
            setSpecialization={setSpecialization}
          />
        </aside>

        <main className="flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Finding Your Legal Match</h1>
            <p className="text-gray-500 font-medium">Connect with verified NGOs and Lawyers tailored to your case.</p>
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
                    onRequest={setSelectedProfile}
                    onReject={handleReject}
                  />
                ))}
            </div>
          )}
        </main>
      </div>

      {/* Send Request Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900">Send Chat Request</h3>
              <button 
                onClick={() => setSelectedProfile(null)}
                className="text-gray-400 hover:text-gray-600 hover:rotate-90 transition-all p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile.name}`}
                  className="w-12 h-12 rounded-full"
                  alt="target"
                />
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">To</p>
                  <p className="font-bold text-gray-900">{selectedProfile.name}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Introductory Message (Optional)</label>
                <textarea
                  placeholder="Tell them a bit about your case and why you're reaching out..."
                  className="w-full border border-gray-200 rounded-2xl p-4 text-gray-700 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Attachment URL (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://example.com/file.pdf"
                    className="w-full border border-gray-200 rounded-2xl p-4 pl-12 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                  />
                  <Paperclip className="w-5 h-5 text-gray-400 absolute left-4 top-4" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setSelectedProfile(null)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                className="flex-1 bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <Send className="w-5 h-5" />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
