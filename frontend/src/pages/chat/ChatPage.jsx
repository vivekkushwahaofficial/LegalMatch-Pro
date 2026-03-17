import React, { useState } from "react";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";
import Sidebar from "../../components/Sidebar";

const ChatPage = () => {

  const [selectedChat, setSelectedChat] = useState(null);

  return (

    <div className="flex h-screen bg-gray-50">

      {/* Left navigation sidebar */}
      <Sidebar />

      {/* Conversation list */}
      <ConversationList onSelectChat={setSelectedChat} />

      {/* Chat messages */}
      <ChatWindow chat={selectedChat} />

    </div>

  );
};

export default ChatPage;