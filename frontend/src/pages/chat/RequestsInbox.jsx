import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import { Check, X, MessageSquare, Paperclip } from "lucide-react";

const RequestsInbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiCall("/matches/my", "GET");
      // Filter for REQUESTED status (Incoming for NGOs/Lawyers)
      const incoming = data.filter(r => r.matchStatus === "REQUESTED");
      setRequests(incoming);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (matchId, approved) => {
    try {
      const endpoint = approved ? `/matches/${matchId}/accept` : `/matches/${matchId}/reject`;
      await apiCall(endpoint, "PUT");
      setRequests(requests.filter(r => r.matchId !== matchId));
      alert(approved ? "Request Approved!" : "Request Rejected!");
    } catch (error) {
      alert("Failed to update request");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 text-lg">Loading requests...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-blue-600" />
        Connection Requests
      </h1>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-500 text-lg">No pending requests at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((req) => (
            <div key={req.matchId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {req.matchedUserName?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{req.matchedUserName}</h3>
                      <p className="text-sm text-gray-500 font-medium">Case: {req.caseTitle}</p>
                    </div>
                  </div>
                  
                  {req.requestMessage && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 relative">
                      <p className="text-gray-700 italic text-sm leading-relaxed">
                        "{req.requestMessage}"
                      </p>
                    </div>
                  )}

                  {req.attachmentUrl && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded-lg w-fit">
                      <Paperclip className="w-4 h-4" />
                      <a href={req.attachmentUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 ml-4">
                  <button
                    onClick={() => handleAction(req.matchId, true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Check className="w-5 h-5" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleAction(req.matchId, false)}
                    className="flex items-center gap-2 bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    <X className="w-5 h-5" />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsInbox;
