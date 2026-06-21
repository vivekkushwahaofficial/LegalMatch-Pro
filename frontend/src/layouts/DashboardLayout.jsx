import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationPanel from "../components/NotificationPanel";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const userName = localStorage.getItem("userName") || "User";
  const resolvedRole = (user?.role || localStorage.getItem("role") || role || "USER").toUpperCase();
  const formattedRole = resolvedRole.charAt(0) + resolvedRole.slice(1).toLowerCase();

  const initials = userName
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-white">

      <Sidebar role={role} />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">

        <header className="h-14 sm:h-16 flex items-center justify-between pl-14 md:pl-6 pr-4 sm:pr-8 border-b border-slate-100 shrink-0">

          <div className="flex items-center gap-3 ml-auto">

            {/* ✅ Notification */}
            <NotificationPanel />

            {/* Profile identity */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                aria-label="Open profile menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
                  <span className="text-xs font-bold">
                    {initials}
                  </span>
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-slate-900">{userName}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-500">{formattedRole}</span>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-lg p-3 z-30">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                      <span className="text-xs font-bold">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{userName}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{formattedRole}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>

        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;