import React, { useState } from "react";
import "./style.scss";

interface FastFiltersProps {
  weaponTypes: string[];
  onFilterSelect: (weaponType: string) => void;
}

const FastFilters: React.FC<FastFiltersProps> = ({
  weaponTypes,
  onFilterSelect,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleFilterClick = (weaponType: string) => {
    setActiveFilter(weaponType);
    onFilterSelect(weaponType);
  };

  return (
    <div className='fast-filters-container'>
      <div className='fast-filters-box'>
        <span
          className={`fast-filter-item ${
            activeFilter === "All" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("All")}
        >
          All
        </span>
        {weaponTypes.map((weaponType) => (
          <span
            className={`fast-filter-item ${
              activeFilter === weaponType ? "active" : ""
            }`}
            key={weaponType}
            onClick={() => handleFilterClick(weaponType)}
          >
            {weaponType}
          </span>
        ))}
      </div>
      <div className='gradient-overlay'></div>
    </div>
  );
};

export default FastFilters;
