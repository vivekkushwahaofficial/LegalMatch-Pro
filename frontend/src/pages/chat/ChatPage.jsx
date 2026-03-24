import React, { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import { MessageSquareOff } from "lucide-react";

const ChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/matches/my", "GET");
      // Only show APPROVED matches in the chat list
      const approved = data.filter(m => m.matchStatus === "APPROVED");
      setConversations(approved);
    } catch (error) {
      console.error("Failed to load conversations", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden shadow-2xl rounded-tl-3xl">
      <ConversationList
        conversations={conversations}  
        onSelectChat={setSelectedChat}
        selectedMatch={selectedChat}
      />

      <div className="flex-1 overflow-hidden">
        {selectedChat ? (
          <ChatWindow match={selectedChat} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-[#fafafa] p-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <MessageSquareOff className="w-12 h-12 text-gray-200" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Select a Chat</h2>
            <p className="text-gray-400 max-w-xs font-medium">Continue your legal advocacy journey by selecting an approved connection from your list.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;