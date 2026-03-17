import { useState } from "react";

const NotificationPanel = () => {

  const [open, setOpen] = useState(false);

  // Dummy notifications (backend later)
  const notifications = [
    {
      id: 1,
      text: "New match found for your case",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      text: "Message received from Lawyer",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      text: "Appointment scheduled successfully",
      time: "Yesterday",
      read: true
    }
  ];

  return (

    <div className="relative">

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-slate-400 hover:text-slate-600"
      >
        🔔

        {/* Red Dot */}
        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Dropdown */}
      {open && (

        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50">

          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">

            {notifications.map((n) => (

              <div
                key={n.id}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                  !n.read ? "bg-gray-100" : ""
                }`}
              >

                <div>{n.text}</div>

                <div className="text-xs text-gray-500 mt-1">
                  {n.time}
                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
};

export default NotificationPanel;