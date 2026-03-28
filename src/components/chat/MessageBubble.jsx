import React from "react";
import { format } from "date-fns";
import { Paperclip, FileText, ExternalLink } from "lucide-react";

const MessageBubble = ({ message, isOwn }) => {
  const isImage = (url) => url && /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(url);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} group animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[70%] space-y-1 ${isOwn ? "items-end" : "items-start"}`}>
        
        {/* Content Box */}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
          }`}
        >
          {/* File/Attachment Logic */}
          {message.fileUrl && (
            <div className="mb-3 overflow-hidden rounded-xl border border-gray-100/20">
              {isImage(message.fileUrl) ? (
                <div className="relative group/img">
                  <img 
                    src={message.fileUrl} 
                    alt="attachment" 
                    className="max-h-60 w-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  />
                  <a 
                    href={message.fileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 bg-black/20 transition-opacity"
                  >
                    <ExternalLink className="w-6 h-6 text-white" />
                  </a>
                </div>
              ) : (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-3 p-3 no-underline ${isOwn ? "bg-white/10 hover:bg-white/20" : "bg-gray-50 hover:bg-gray-100"}`}
                >
                  <div className={`p-2 rounded-lg ${isOwn ? "bg-white/20" : "bg-blue-100"}`}>
                    <FileText className={`w-5 h-5 ${isOwn ? "text-white" : "text-blue-600"}`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-xs font-bold truncate ${isOwn ? "text-white" : "text-gray-900"}`}>Attached Document</p>
                    <p className={`text-[10px] opacity-70 ${isOwn ? "text-white" : "text-gray-500"}`}>Click to view</p>
                  </div>
                </a>
              )}
            </div>
          )}

          <p className="leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>

        {/* Timestamp */}
        <div className={`flex items-center gap-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <span className="text-[10px] text-gray-400 font-medium">
            {message.timestamp ? format(new Date(message.timestamp), "h:mm a") : "Just now"}
          </span>
          {isOwn && <span className="text-[10px] text-blue-400">Sent</span>}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;