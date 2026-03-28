import { useState } from "react";
import ConversationList from "../../components/chat/ConversationList";
import ChatWindow from "../../components/chat/ChatWindow";

const ChatPage = () => {

  const [activeChat, setActiveChat] = useState(null);

  const conversations = [
    { id: 1, providerName: "Anya Sharma (Lawyer)", matchScore: 92 },
    { id: 2, providerName: "Legal Aid Foundation (NGO)", matchScore: 88 },
    { id: 3, providerName: "Michael Chen (Lawyer)", matchScore: 85 }
  ];

  return (

    <div className="flex h-screen">

      <ConversationList
        conversations={conversations}
        onSelectChat={setActiveChat}
      />

      <ChatWindow match={activeChat} />

    </div>

  );

};

export default ChatPage;