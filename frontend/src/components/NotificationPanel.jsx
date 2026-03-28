import { useEffect, useState } from "react";
import { apiCall } from "../api/apiConfig";

const NotificationPanel = () => {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const data = await apiCall("/notifications", "GET");
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await apiCall(`/notifications/${notificationId}/read`, "PUT");
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const unreadCount = notifications.filter((n) => !(n.isRead || n.readStatus || n.read)).length;

  const formatTime = (isoValue) => {
    if (!isoValue) return "now";
    const created = new Date(isoValue);
    if (Number.isNaN(created.getTime())) return "now";

    const diffMs = Date.now() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d ago`;
  };

  return (

    <div className="relative">

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-slate-400 hover:text-slate-600"
      >
        🔔

        {/* Red Dot */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (

        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-lg border z-50">

          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">

            {notifications.length === 0 && (
              <div className="p-4 text-sm text-gray-500">No notifications yet.</div>
            )}

            {notifications.map((n) => {
              const isRead = n.isRead || n.readStatus || n.read;
              return (

                <div
                  key={n.id}
                  onClick={() => !isRead && markAsRead(n.id)}
                  className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${!isRead ? "bg-gray-100" : ""
                    }`}
                >

                  <div>{n.message || n.text}</div>

                  <div className="text-xs text-gray-500 mt-1">
                    {formatTime(n.createdAt)}
                  </div>

                </div>

              );
            })}

          </div>

        </div>

      )}

    </div>
  );
};

export default NotificationPanel;