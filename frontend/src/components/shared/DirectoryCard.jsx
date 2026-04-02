import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ShieldCheck } from "lucide-react";
import InitialsAvatar from "./InitialsAvatar";

const DirectoryCard = ({
  title,
  subtitle,
  location,
  details,
  verified,
  profileUrl,
  ctaLabel,
  accent = "indigo",
}) => {
  const hasUrl = Boolean(profileUrl);

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group">
      <div className="flex items-start justify-between mb-6">
        <InitialsAvatar
          name={title}
          size={64}
          className={accent === "pink" ? "bg-pink-50 text-pink-700" : "bg-indigo-50 text-indigo-700"}
          textClassName="text-lg"
        />
        {verified && (
          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-bold ring-1 ring-green-100">
            <ShieldCheck size={14} /> VERIFIED
          </div>
        )}
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title || "Unnamed"}</h3>
      <p className={(accent === "pink" ? "text-pink-600" : "text-indigo-600") + " font-bold text-sm uppercase tracking-wider mb-6"}>
        {subtitle || "Not Provided"}
      </p>

      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 text-gray-500 font-medium">
          <MapPin size={18} className="text-gray-400" />
          {location || "Not Provided"}
        </div>
        <div className="text-sm text-gray-400 italic">{details || "No additional details available."}</div>
      </div>

      <Link
        to={hasUrl ? profileUrl : "#"}
        onClick={(e) => {
          if (!hasUrl) e.preventDefault();
        }}
        aria-disabled={!hasUrl}
        className="block w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-all text-center"
      >
        {ctaLabel}
      </Link>
    </div>
  );
};

export default DirectoryCard;
