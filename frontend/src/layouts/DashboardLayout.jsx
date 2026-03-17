import NotificationPanel from "../components/NotificationPanel";
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ role }) => {

  const userName = localStorage.getItem("userName") || "User";

  const initials = userName
    .split(" ")
    .map(word => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-screen bg-white">

      <Sidebar role={role} />

      <div className="flex-1 flex flex-col overflow-hidden bg-white">

        <header className="h-16 flex items-center justify-end px-8 border-b border-slate-100 shrink-0">

          <div className="flex items-center gap-4">

            {/* ✅ Notification */}
            <NotificationPanel />

            {/* Profile */}
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 overflow-hidden">
              <span className="text-xs font-bold">
                {initials}
              </span>
            </div>

          </div>

        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default DashboardLayout;