import React from "react";

const ConversationList = ({ conversations, onSelectChat }) => {

  return (

    <div className="w-80 border-r bg-white flex flex-col">

      {/* search box */}

      <div className="p-4 border-b">

        <input
          className="w-full border rounded p-2 text-sm"
          placeholder="Search conversations..."
        />

      </div>

      {/* conversation list */}

      <div className="flex-1 overflow-y-auto">

        {conversations.map((c) => (

          <div
            key={c.id}
            onClick={() => onSelectChat(c)}
            className="p-4 cursor-pointer hover:bg-gray-100 border-b"
          >

            <div className="font-semibold">
              {c.providerName}
            </div>

            <div className="text-xs text-gray-500">
              Match Score: {c.matchScore}%
            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default ConversationList;