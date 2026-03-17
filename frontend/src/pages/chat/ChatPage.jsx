import React, { useState } from "react";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";

const ChatPage = () => {

  const [selectedChat, setSelectedChat] = useState(null);

  // ✅ Dummy data (VERY IMPORTANT)
  const conversations = [
    { id: 1, providerName: "Anya Sharma (Lawyer)", matchScore: 92 },
    { id: 2, providerName: "Legal Aid Foundation (NGO)", matchScore: 88 },
    { id: 3, providerName: "Michael Chen (Lawyer)", matchScore: 85 }
  ];

  return (

    <div className="flex h-screen bg-gray-50">

      {/* Conversation list */}
      <ConversationList
        conversations={conversations}  
        onSelectChat={setSelectedChat}
      />

      {/* Chat messages */}
      <ChatWindow match={selectedChat} /> 

    </div>

  );
};

export default ChatPage;