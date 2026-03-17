const MessageBubble = ({ message }) => {

  const isMine = message.sender === "USER";

  return (

    <div
      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
    >

      <div
        className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
          isMine
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-800"
        }`}
      >

        {message.content}

        <div className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>

      </div>

    </div>

  );
};

export default MessageBubble;