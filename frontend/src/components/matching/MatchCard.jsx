import { Link } from "react-router-dom";
import { MessageCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function MatchCard({ profile, onAccept, onReject }) {

  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Accept Match",
          icon: <CheckCircle2 className="w-4 h-4" />,
          color: "bg-blue-600 hover:bg-blue-700",
          action: () => onAccept(profile)
        };
      case "REQUESTED":
        return {
          label: "Requested",
          icon: <Clock className="w-4 h-4" />,
          color: "bg-gray-400 cursor-not-allowed",
          disabled: true
        };
      case "APPROVED":
      case "ACCEPTED":
        return {
          label: "Message",
          icon: <MessageCircle className="w-4 h-4" />,
          color: "bg-green-600 hover:bg-green-700",
          link: "/citizen/chat"
        };
      case "REJECTED":
        return {
          label: "Rejected",
          icon: <XCircle className="w-4 h-4" />,
          color: "bg-red-500 cursor-not-allowed",
          disabled: true
        };
      default:
        return { label: "Unknown", color: "bg-gray-200" };
    }
  };

  const config = getStatusConfig(profile.status);

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-all duration-300">

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
            alt="profile"
            className="w-14 h-14 rounded-full border-2 border-blue-100 p-0.5"
          />
          {(profile.status === "APPROVED" || profile.status === "ACCEPTED") && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full"></div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight">{profile.name}</h3>
          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">{profile.role}</p>
        </div>
      </div>

      {/* Match Score */}
      <div className="mb-4">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Match Score</span>
          <span className="text-sm font-black text-blue-700">{profile.score}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-1000"
            style={{ width: `${profile.score}%` }}
          ></div>
        </div>
      </div>

      {/* Specialization Tag */}
      <div className="mb-6">
        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-lg border border-blue-100">
          {profile.specialization}
        </span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        {config.link ? (
          <Link to={config.link} className="block w-full">
            <button className={`w-full ${config.color} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm`}>
              {config.icon}
              {config.label}
            </button>
          </Link>
        ) : (
          <button
            onClick={config.action}
            disabled={config.disabled}
            className={`w-full ${config.color} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm`}
          >
            {config.icon}
            {config.label}
          </button>
        )}

        {profile.status === "PENDING" && (
          <button
            onClick={() => onReject(profile)}
            className="w-full bg-white text-gray-500 py-2.5 rounded-xl font-bold text-sm border border-gray-100 hover:bg-gray-50 transition-all hover:text-red-500"
          >
            Pass for now
          </button>
        )}

        <Link to={`/lawyer-profile/${profile.id}`} className="block w-full text-center">
          <span className="text-xs font-bold text-gray-400 hover:text-blue-500 uppercase tracking-widest transition-colors cursor-pointer block mt-2">
            View full credentials
          </span>
        </Link>
      </div>

    </div>
  );
}