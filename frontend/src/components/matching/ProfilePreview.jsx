export default function ProfilePreview({ profile }) {
  const avatarSeed = String(profile?.id || profile?.email || profile?.name || "user").trim();
  const avatarSrc = profile?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;

  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-4">

      <img
        src={avatarSrc}
        alt="profile"
        className="w-14 h-14 rounded-full"
      />

      <div className="flex-1">
        <h3 className="font-semibold text-lg">
          {profile.name}
        </h3>

        <p className="text-sm text-gray-600">
          {profile.role}
        </p>

        <p className="text-sm text-gray-500">
          {profile.specialization}
        </p>
      </div>

      <div className="text-purple-600 font-semibold">
        {profile.score}% Match
      </div>

    </div>
  );
}