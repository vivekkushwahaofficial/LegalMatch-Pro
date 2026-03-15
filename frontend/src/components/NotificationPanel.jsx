export default function NotificationPanel() {

  const notifications = [
    {
      id: 1,
      message: "New lawyer match found for your case.",
      time: "2 minutes ago"
    },
    {
      id: 2,
      message: "You received a new message from Sarah Chen.",
      time: "10 minutes ago"
    },
    {
      id: 3,
      message: "Your appointment has been scheduled.",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg p-4">

      <h3 className="font-semibold mb-3">
        Notifications
      </h3>

      <div className="space-y-3">

        {notifications.map((note) => (
          <div
            key={note.id}
            className="p-3 border rounded-md hover:bg-gray-50"
          >
            <p className="text-sm">{note.message}</p>

            <span className="text-xs text-gray-500">
              {note.time}
            </span>
          </div>
        ))}

      </div>

    </div>
  );
}