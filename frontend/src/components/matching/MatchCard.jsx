import { Link } from "react-router-dom";

export default function MatchCard({ profile, onAccept, onReject }) {

  const getScoreColor = (score) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-400";
    return "bg-red-500";
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">

      {/* Profile Info */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={`https://i.pravatar.cc/100?img=${profile.id}`}
          alt="profile"
          className="w-12 h-12 rounded-full"
        />

        <div>
          <h3 className="font-semibold">{profile.name}</h3>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>

      {/* Score */}
      <p className="text-sm mb-2">Match Score: {profile.score}%</p>

      <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
        <div
          className={`${getScoreColor(profile.score)} h-2 rounded-full`}
          style={{ width: `${profile.score}%` }}
        ></div>
      </div>

      {/* Specialization */}
      <p className="text-sm text-gray-600 mb-3">
        {profile.specialization}
      </p>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onAccept(profile)}
          className="flex-1 bg-green-500 text-white py-2 rounded"
        >
          Accept
        </button>

        <button
          onClick={() => onReject(profile)}
          className="flex-1 bg-red-500 text-white py-2 rounded"
        >
          Reject
        </button>
      </div>

      {/* View Profile */}
      <Link to={`/lawyer-profile/${profile.id}`}>
        <button className="w-full mt-3 bg-purple-600 text-white py-2 rounded">
          View Profile
        </button>
      </Link>

    </div>
  );
}