import React from "react";

const EmptyState = ({ title = "No data", message = "No records available.", className = "" }) => {
  return (
    <div className={`col-span-full text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
    </div>
  );
};

export default EmptyState;
