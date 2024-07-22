import React, { useState } from "react";

import Skeleton from "@mui/material/Skeleton";
import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";

import "./style.scss";

interface SortProps {
  isLoading: boolean;
  onSort: (sortOption: string) => void;
}

const Sort: React.FC<SortProps> = ({ isLoading, onSort }) => {
  const [sortOption, setSortOption] = useState("relevant");

  const handleApply = () => {
    onSort(sortOption);
  };

  if (isLoading) {
    return (
      <div className='sort-skeleton'>
        <Skeleton
          variant='rounded'
          width={24}
          height={24}
          animation='wave'
          sx={{ bgcolor: "var(--color-surface)" }}
        />
      </div>
    );
  }

  return (
    <Modal
      modalTitle='Sort'
      trigger={<span className='material-symbols-outlined'>swap_vert</span>}
      fade={true}
      subModal={false}
      height='60dvh'
      closeElement={
        <Button
          label='Apply'
          className='btn-primary-50 icon'
          onClick={handleApply}
        />
      }
      className='sub-filter-modal'
    >
      <div className='content sort'>
        <div className='price-box'>
          <p className='title'>Price</p>
          <div className='options'>
            <p
              className={`option ${sortOption === "relevant" ? "active" : ""}`}
              onClick={() => setSortOption("relevant")}
            >
              Relevant
            </p>
            <p
              className={`option ${
                sortOption === "price_low_to_high" ? "active" : ""
              }`}
              onClick={() => setSortOption("price_low_to_high")}
            >
              From low to high
            </p>
            <p
              className={`option ${
                sortOption === "price_high_to_low" ? "active" : ""
              }`}
              onClick={() => setSortOption("price_high_to_low")}
            >
              From high to low
            </p>
          </div>
        </div>
        <div className='rarity-box'>
          <p className='title'>Rarity</p>
          <div className='options'>
            <p
              className={`option ${sortOption === "relevant" ? "active" : ""}`}
              onClick={() => setSortOption("relevant")}
            >
              Relevant
            </p>
            <p
              className={`option ${
                sortOption === "rarity_low_to_high" ? "active" : ""
              }`}
              onClick={() => setSortOption("rarity_low_to_high")}
            >
              From low to high
            </p>
            <p
              className={`option ${
                sortOption === "rarity_high_to_low" ? "active" : ""
              }`}
              onClick={() => setSortOption("rarity_high_to_low")}
            >
              From high to low
            </p>
          </div>
        </div>
        <Button
          label='Reset'
          className='btn-tertiary-white-35'
          icon='refresh'
          onClick={() => setSortOption("relevant")}
        />
      </div>
    </Modal>
  );
};

export default Sort;
