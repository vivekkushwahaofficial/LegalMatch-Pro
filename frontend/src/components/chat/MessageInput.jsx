import { useState } from "react";
import { apiCall } from "../../api/apiConfig";

const MessageInput = ({ matchId, onSend }) => {

  const [text, setText] = useState("");

  const sendMessage = async () => {

    if (!text.trim()) return;

    try {

      await apiCall("/chats/send", "POST", {
        matchId: matchId,
        message: text
      });

      setText("");

      onSend();

    } catch (error) {

      console.log("Failed to send message");

    }

  };

  return (

    <div className="p-3 border-t flex gap-2">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border rounded-lg px-3 py-2"
      />

      <button
        onClick={sendMessage}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
      >
        Send
      </button>

    </div>

  );
};

export default MessageInput;