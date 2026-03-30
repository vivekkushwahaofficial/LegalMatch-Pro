import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CalendarDays, CheckCheck, MessageSquare, ShieldAlert } from "lucide-react";
import { apiCall } from "../api/apiConfig";

const NotificationPanel = () => {

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const getNotificationMeta = (type) => {
    const normalized = String(type || "").toUpperCase();

    if (normalized.includes("CHAT") || normalized.includes("MESSAGE")) {
      return {
        icon: MessageSquare,
        badgeClass: "bg-blue-100 text-blue-700",
        label: "Chat",
      };
    }

    if (normalized.includes("APPOINTMENT")) {
      return {
        icon: CalendarDays,
        badgeClass: "bg-indigo-100 text-indigo-700",
        label: "Appointment",
      };
    }

    if (normalized.includes("MATCH") || normalized.includes("CASE")) {
      return {
        icon: ShieldAlert,
        badgeClass: "bg-amber-100 text-amber-700",
        label: "Case",
      };
    }

    return {
      icon: Bell,
      badgeClass: "bg-slate-100 text-slate-700",
      label: "System",
    };
  };

  return (

    <div ref={dropdownRef} className="relative">

      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative text-slate-400 hover:text-slate-600 transition-colors"
      >
        🔔

        {/* Red Dot */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Dropdown */}
      {open && (

        <div className="absolute right-0 mt-3 w-96 bg-white shadow-xl rounded-2xl border border-slate-100 z-50 overflow-hidden">

          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="font-semibold text-slate-900">Notifications</div>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">

            {notifications.length === 0 && (
              <div className="p-5 text-sm text-slate-500">No notifications yet.</div>
            )}

            {notifications.map((n) => {
              const isRead = n.isRead || n.readStatus || n.read;
              const meta = getNotificationMeta(n.type);
              const Icon = meta.icon;
              return (

                <div
                  key={n.id}
                  onClick={() => !isRead && markAsRead(n.id)}
                  className={`p-4 text-sm cursor-pointer transition-colors hover:bg-slate-50 ${!isRead ? "bg-blue-50/50" : ""
                    }`}
                >

                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center ${meta.badgeClass}`}>
                      <Icon size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{meta.label}</span>
                        {!isRead && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                      </div>

                      <div className={`mt-1 ${isRead ? "text-slate-700" : "text-slate-900 font-medium"}`}>
                        {n.message || n.text}
                      </div>

                      <div className="text-xs text-slate-500 mt-1">
                        {formatTime(n.createdAt)}
                      </div>
                    </div>
                  </div>

                </div>

              );
            })}

          </div>

          <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/70">
            <Link
              to="/notifications"
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setOpen(false)}
            >
              <CheckCheck size={16} />
              View All
            </Link>
          </div>

        </div>

      )}

    </div>
  );
};

export default NotificationPanel;