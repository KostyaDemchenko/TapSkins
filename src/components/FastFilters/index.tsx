import React, { useState, useEffect } from "react";

import Skeleton from "@mui/material/Skeleton";

import "./style.scss";

interface FastFiltersProps {
  weaponTypes: string[];
  isLoading: boolean;
  onFilterSelect: (weaponType: string) => void;
}

const FastFilters: React.FC<FastFiltersProps> = ({
  weaponTypes,
  isLoading,
  onFilterSelect,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const handleFilterClick = (weaponType: string) => {
    setActiveFilter(weaponType);
    onFilterSelect(weaponType);
  };

  if (isLoading) {
    return (
      <div className='fast-filters-container'>
        <div className='fast-filters-box'>
          {Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
              variant='text'
              width={50}
              height={30}
              animation='wave'
              sx={{ bgcolor: "var(--color-surface)" }}
            />
          ))}
        </div>
        <div className='gradient-overlay'></div>
      </div>
    );
  }

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
