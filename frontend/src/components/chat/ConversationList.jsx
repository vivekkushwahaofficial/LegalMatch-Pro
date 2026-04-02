import React, { useState } from "react";
import { Search, MoreVertical, MessageSquare } from "lucide-react";
import InitialsAvatar from "../shared/InitialsAvatar";

const ConversationList = ({ conversations, onSelectChat, selectedMatch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = (conversations || []).filter(c =>
    (c.providerName || c.matchedUserName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-96 border-r border-gray-100 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Messages</h2>
        <button className="p-2 hover:bg-gray-50 rounded-full text-gray-400">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative group">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400 font-medium"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-sm text-gray-400 font-medium italic">No conversations found</p>
          </div>
        ) : (
          filtered.map((c) => {
            const isSelected = selectedMatch && (selectedMatch.id === c.id || selectedMatch.matchId === c.matchId);
            const name = c.providerName || c.matchedUserName;

            return (
              <div
                key={c.id || c.matchId}
                onClick={() => onSelectChat(c)}
                className={`flex items-center gap-4 p-4 mx-3 my-1 cursor-pointer rounded-2xl transition-all duration-200 ${isSelected
                    ? "bg-blue-50 shadow-sm"
                    : "hover:bg-gray-50"
                  }`}
              >
                <div className="relative">
                  <InitialsAvatar
                    name={name}
                    size={48}
                    className="border border-gray-100 shadow-sm bg-slate-100 text-slate-700"
                    textClassName="text-xs"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className={`font-bold truncate text-[15px] ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                      {name}
                    </h4>
                    <span className="text-[10px] text-gray-400">Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-md uppercase tracking-tight">
                      {c.matchScore || c.score}% match
                    </span>
                    <p className={`text-xs truncate ${isSelected ? "text-blue-600/70" : "text-gray-500"} font-medium`}>
                      discussing case...
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationList;