import React from "react";

const ErrorState = ({ message = "Something went wrong.", className = "" }) => {
  return (
    <div className={`rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`} role="alert">
      {message}
    </div>
  );
};

export default ErrorState;
