import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ match }) => {

  const [messages, setMessages] = useState([]);

  useEffect(() => {

    if (match) {
      fetchMessages();
    }

  }, [match]);

  const fetchMessages = async () => {

    try {

      const data = await apiCall(`/chats/${match.id}`, "GET");

      setMessages(data);

    } catch (error) {

      console.log("Failed to load messages");

    }

  };

  if (!match) {

    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );

  }

  return (

    <div className="flex flex-col flex-1">

      {/* Header */}

      <div className="p-4 border-b font-semibold">
        {match.providerName}
      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

      </div>

      {/* Input */}

      <MessageInput
        matchId={match.id}
        onSend={fetchMessages}
      />

    </div>

  );

};

export default ChatWindow;