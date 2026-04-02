import InitialsAvatar from "../shared/InitialsAvatar";

export default function ProfilePreview({ profile }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 flex items-center gap-4">

      {profile?.profileImage ? (
        <img
          src={profile.profileImage}
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <InitialsAvatar
          name={profile?.name}
          size={56}
          className="bg-slate-200 text-slate-700"
          textClassName="text-sm"
        />
      )}

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