import React from "react";

const FilterPanel = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 w-full lg:max-w-5xl ${className}`}>
      {children}
    </div>
  );
};

export default FilterPanel;
