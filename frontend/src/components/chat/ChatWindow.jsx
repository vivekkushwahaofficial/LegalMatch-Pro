import { useEffect, useState } from "react";
import { apiCall, getValidAccessToken } from "../../api/apiConfig";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { MessageCircle, Send, MoreHorizontal, Info } from "lucide-react";
import InitialsAvatar from "../shared/InitialsAvatar";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatWindow = ({ match }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  useEffect(() => {
    if (match) {
      fetchMessages();
    }
  }, [match]);

  useEffect(() => {
    if (!match) return;

    const matchId = match.id || match.matchId;
    if (!matchId) return;

    const wsUrl = import.meta.env.VITE_API_WS_URL || "http://localhost:8080/ws";
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 3000,
      debug: () => { },
    });

    client.beforeConnect = async () => {
      const token = await getValidAccessToken();
      if (!token) {
        throw new Error("Missing access token for websocket connection");
      }

      client.configure({
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    client.onConnect = () => {
      setIsRealtimeConnected(true);

      client.subscribe(`/topic/chats/${matchId}`, (frame) => {
        try {
          const incoming = JSON.parse(frame.body);
          setMessages((prev) => {
            // Prevent duplicate append if message already exists from polling refresh.
            if (prev.some((m) => m.id && incoming.id && m.id === incoming.id)) {
              return prev;
            }
            return [...prev, incoming];
          });
        } catch (err) {
          console.error("Failed to parse realtime message", err);
        }
      });
    };

    client.onStompError = () => {
      setIsRealtimeConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsRealtimeConnected(false);
    };

    client.activate();

    return () => {
      setIsRealtimeConnected(false);
      try {
        client.deactivate();
      } catch (_) {
        // noop
      }
    };
  }, [match?.id, match?.matchId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await apiCall(`/chats/${match.id || match.matchId}`, "GET");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
          ? data.messages
          : Array.isArray(data?.data)
            ? data.data
            : [];
      setMessages(list);
    } catch (error) {
      console.error("Failed to load messages", error);
    } finally {
      setLoading(false);
    }
  };

  if (!match) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-12 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <MessageCircle className="w-12 h-12 text-blue-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Your Conversations</h2>
        <p className="text-gray-500 max-w-xs">Select a verified legal professional to start discussing your case securely.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white h-full overflow-hidden border-l border-gray-100">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <InitialsAvatar
              name={match.providerName || match.matchedUserName}
              size={40}
              className="border border-gray-100 bg-slate-100 text-slate-700"
              textClassName="text-xs"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">
              {match.providerName || match.matchedUserName}
            </h3>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isRealtimeConnected ? "text-green-600" : "text-gray-400"}`}>
              {isRealtimeConnected ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 bg-[#fafafa]">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-10">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          (messages || []).map((msg, index) => (
            <MessageBubble
              key={msg.id || index}
              message={msg}
              isOwn={msg.senderId === Number(localStorage.getItem("userId"))}
            />
          ))
        )}
        {messages.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-blue-300" />
            </div>
            <p className="text-gray-400 font-medium italic">Your conversation is ready. Start by saying hello!</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <MessageInput
          matchId={match.id || match.matchId}
          onSend={fetchMessages}
        />
      </div>
    </div>
  );
};

export default ChatWindow;