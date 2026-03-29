import { Link } from "react-router-dom";
import { useState } from "react";
import NotificationPanel from "./NotificationPanel";

export default function Navbar() {

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-xl font-bold text-purple-600">
        LegalAid
      </h1>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">

        <Link
          to="/dashboard"
          className="text-gray-600 hover:text-purple-600"
        >
          Dashboard
        </Link>

        <Link
          to="/matches"
          className="text-gray-600 hover:text-purple-600"
        >
          Matches
        </Link>

        <Link
          to="/assigned-cases"
          className="text-gray-600 hover:text-purple-600"
        >
          Cases
        </Link>

        <Link
          to="/chat"
          className="text-gray-600 hover:text-purple-600"
        >
          Chat
        </Link>

        {/* Notification Bell */}
        <div className="relative">

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-xl"
          >
            🔔
          </button>

          {showNotifications && <NotificationPanel />}

        </div>

      </div>

    </nav>
  );
}