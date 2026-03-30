import { useEffect, useMemo, useState } from "react";
import { Bell, Filter, CheckCheck } from "lucide-react";
import { apiCall } from "../../api/apiConfig";

const NOTIFICATION_TYPE_OPTIONS = ["ALL", "MATCH", "CHAT", "APPOINTMENT"];

const getReadState = (item) => item.isRead || item.readStatus || item.read;

const mapToTypeGroup = (rawType) => {
  const type = String(rawType || "").toUpperCase();
  if (type.includes("MATCH")) return "MATCH";
  if (type.includes("CHAT") || type.includes("MESSAGE")) return "CHAT";
  if (type.includes("APPOINTMENT")) return "APPOINTMENT";
  return "OTHER";
};

const formatTimestamp = (isoValue) => {
  if (!isoValue) return "Unknown time";
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString();
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !getReadState(item)).length,
    [notifications]
  );

  // Keep read/unread state updates local and instant for smooth UX.
  const markLocalAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRead: true, readStatus: true, read: true } : item
      )
    );
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await apiCall("/notifications", "GET");
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load notifications", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await apiCall(`/notifications/${id}/read`, "PUT");
      markLocalAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      alert("Unable to mark this notification as read");
    }
  };

  const markAllAsRead = async () => {
    const unread = notifications.filter((item) => !getReadState(item));
    if (unread.length === 0) return;

    try {
      await Promise.all(unread.map((item) => apiCall(`/notifications/${item.id}/read`, "PUT")));
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readStatus: true, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
      alert("Some notifications could not be marked as read");
      await fetchNotifications();
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const isRead = getReadState(item);
      const groupedType = mapToTypeGroup(item.type);

      const statusPass = statusFilter === "ALL" || (statusFilter === "UNREAD" && !isRead);
      const typePass = typeFilter === "ALL" || groupedType === typeFilter;

      return statusPass && typePass;
    });
  }, [notifications, statusFilter, typeFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-600" />
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View your full notification history and manage read/unread status.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
              {unreadCount} unread
            </span>
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCheck className="w-4 h-4" />
              Mark All as Read
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
          <Filter className="w-4 h-4" />
          Filters
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${statusFilter === "ALL" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"
                }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("UNREAD")}
              className={`px-3 py-2 rounded-lg text-sm font-medium border ${statusFilter === "UNREAD" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200"
                }`}
            >
              Unread
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700"
          >
            {NOTIFICATION_TYPE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value === "ALL" ? "All Types" : value}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        {loading ? (
          <p className="text-slate-500">Loading notifications...</p>
        ) : filteredNotifications.length === 0 ? (
          <p className="text-slate-500">No notifications found for selected filters.</p>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => {
              const isRead = getReadState(item);
              const groupedType = mapToTypeGroup(item.type);

              return (
                <div
                  key={item.id}
                  className={`border rounded-xl p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3 ${isRead ? "border-slate-200 bg-white" : "border-blue-100 bg-blue-50"
                    }`}
                >
                  <div className="space-y-1">
                    <p className={`text-sm ${isRead ? "text-slate-700" : "text-slate-900 font-bold"}`}>
                      {item.message || "No message"}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {groupedType}
                      </span>
                      <span>{formatTimestamp(item.createdAt)}</span>
                      <span className={`font-semibold ${isRead ? "text-slate-500" : "text-blue-700"}`}>
                        {isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => markAsRead(item.id)}
                    disabled={isRead}
                    className="self-start px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mark as Read
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default NotificationsPage;
