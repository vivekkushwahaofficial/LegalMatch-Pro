import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import { MessageSquareOff } from "lucide-react";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiCall("/matches/my", "GET");

      const matches = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.matches)
            ? data.matches
            : [];

      const approved = matches.filter((m) => {
        const status = String(m?.matchStatus || "").toUpperCase();
        return status === "APPROVED" || status === "ACCEPTED";
      });

      setConversations(approved);
      setSelectedChat((prev) => {
        if (!prev) return null;
        const prevId = prev.matchId ?? prev.id;
        return approved.some((m) => (m.matchId ?? m.id) === prevId) ? prev : null;
      });
    } catch (error) {
      console.error("Failed to load conversations", error);
      setError(error?.message || "Failed to load conversations");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Loading UI (correct place)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 max-w-md w-full shadow-sm">
          <h2 className="text-lg font-extrabold text-gray-900 mb-2">Chat unavailable</h2>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchConversations}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden shadow-2xl rounded-tl-3xl">

      {/* LEFT SIDE */}
      {conversations.length === 0 ? (
        <div className="w-full md:w-1/3 flex items-center justify-center text-gray-400">
          No approved chats available
        </div>
      ) : (
        <div className={`w-full md:w-auto shrink-0 ${selectedChat ? "hidden md:block" : "block"}`}>
          <ConversationList
            conversations={conversations}
            onSelectChat={setSelectedChat}
            selectedMatch={selectedChat}
          />
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className={`flex-1 overflow-hidden h-full ${!selectedChat ? "hidden md:block" : "block"}`}>
        {selectedChat ? (
          <ChatWindow match={selectedChat} onBack={() => setSelectedChat(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-[#fafafa] p-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <MessageSquareOff className="w-12 h-12 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">
              Select a Chat
            </h2>
            <p className="text-gray-400 max-w-xs font-medium">
              Continue your legal advocacy journey by selecting an approved connection.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};

export default ChatPage;