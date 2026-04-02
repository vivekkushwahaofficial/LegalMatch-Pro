import React from "react";

const pickInitials = (name = "") => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const InitialsAvatar = ({ name, size = 40, className = "", textClassName = "" }) => {
  const initials = pickInitials(name);

  return (
    <div
      className={`rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold ${className}`}
      style={{ width: size, height: size }}
      aria-label={name || "Profile avatar"}
      title={name || "Profile avatar"}
    >
      <span className={`leading-none ${textClassName}`}>{initials}</span>
    </div>
  );
};

export default InitialsAvatar;
