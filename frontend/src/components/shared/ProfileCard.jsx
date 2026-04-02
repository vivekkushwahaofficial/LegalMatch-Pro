import React from "react";
import InitialsAvatar from "./InitialsAvatar";

const ProfileCard = ({ name, role, subtitle, children }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <InitialsAvatar name={name} size={48} className="bg-slate-100 text-slate-700" textClassName="text-sm" />
        <div>
          <h3 className="font-semibold text-slate-900">{name || "Unknown"}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-wide">{role || subtitle || "Profile"}</p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ProfileCard;
