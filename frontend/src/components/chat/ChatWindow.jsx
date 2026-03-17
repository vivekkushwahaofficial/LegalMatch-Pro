import { useEffect, useState } from "react";
import { apiCall } from "../../api/apiConfig";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import ScheduleModal from "../schedule/ScheduleModal";

const ChatWindow = ({ match }) => {

  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="p-4 border-b flex justify-between items-center">

        <span className="font-semibold">
          {match.providerName}
        </span>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-sm"
        >
          Schedule Call
        </button>

      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {(messages || []).map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

      </div>

      {/* Input */}
      <MessageInput
        matchId={match.id}
        onSend={fetchMessages}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={match}
      />

    </div>

  );
};

export default ChatWindow;