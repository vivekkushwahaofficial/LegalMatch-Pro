import { useState, useRef } from "react";
import { apiCall } from "../../api/apiConfig";
import { Send, Paperclip, X, Image as ImageIcon } from "lucide-react";

const MessageInput = ({ matchId, onSend }) => {
  const [text, setText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    if (!text.trim() && !attachmentUrl.trim()) return;
    
    setSending(true);
    try {
      await apiCall("/chats/send", "POST", {
        matchId: matchId,
        content: text,
        senderId: Number(localStorage.getItem("userId")),
        fileUrl: attachmentUrl,
        messageType: attachmentUrl ? "FILE" : "TEXT"
      });

      setText("");
      setAttachmentUrl("");
      setShowAttachmentInput(false);
      onSend();
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="space-y-4">
      {showAttachmentInput && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200 animate-in slide-in-from-bottom-4 duration-300">
          <Paperclip className="w-4 h-4 text-blue-500" />
          <input
            type="text"
            placeholder="Paste file or image URL..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-700"
            value={attachmentUrl}
            onChange={(e) => setAttachmentUrl(e.target.value)}
          />
          <button 
            onClick={() => {
              setShowAttachmentInput(false);
              setAttachmentUrl("");
            }}
            className="p-1 hover:bg-gray-200 rounded-full text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        <div className="flex-1 relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Write a message..."
            className="w-full bg-gray-100 border-none rounded-[24px] pl-5 pr-12 py-3.5 text-sm text-gray-700 focus:ring-2 focus:ring-blue-100 transition-all outline-none resize-none min-h-[48px] max-h-[120px]"
            rows="1"
          />
          <button
            onClick={() => setShowAttachmentInput(!showAttachmentInput)}
            className={`absolute right-4 bottom-3.5 transition-colors ${showAttachmentInput ? "text-blue-500" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={sendMessage}
          disabled={sending || (!text.trim() && !attachmentUrl.trim())}
          className={`p-3.5 rounded-full shadow-lg shadow-blue-100 transition-all active:scale-95 ${
            sending || (!text.trim() && !attachmentUrl.trim()) 
            ? "bg-gray-100 text-gray-400" 
            : "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5"
          }`}
        >
          <Send className={`w-5 h-5 ${sending ? "animate-pulse" : ""}`} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;