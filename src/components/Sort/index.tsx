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
    <>
      <span className='material-symbols-rounded modal-icon-trigger' id='sort'>
        swap_vert
      </span>

      <Modal
        modalTitle='Sort'
        triggerId='sort'
        fade={true}
        subModal={false}
        height='60dvh'
        modalBg='var(--color-background-secondary)'
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
            <div className='options'>
              <div
                className='option-box'
                onClick={() => setSortOption("rarity_high_to_low")}
              >
                <p
                  className={`option ${
                    sortOption === "relevant" ? "active" : ""
                  }`}
                  onClick={() => setSortOption("relevant")}
                >
                  Relevant
                </p>
              </div>
              <div
                className='option-box'
                onClick={() => setSortOption("price_high_to_low")}
              >
                <span
                  className={`material-symbols-outlined icon fill ${
                    sortOption === "price_high_to_low" ? "active" : ""
                  }`}
                >
                  sell
                </span>
                <p
                  className={`option ${
                    sortOption === "price_high_to_low" ? "active" : ""
                  }`}
                >
                  Price from high to low
                </p>
              </div>
              <div
                className='option-box'
                onClick={() => setSortOption("price_low_to_high")}
              >
                <span
                  className={`material-symbols-outlined icon ${
                    sortOption === "price_low_to_high" ? "active" : ""
                  }`}
                >
                  sell
                </span>
                <p
                  className={`option ${
                    sortOption === "price_low_to_high" ? "active" : ""
                  }`}
                >
                  Price from low to high
                </p>
              </div>
              <div
                className='option-box'
                onClick={() => setSortOption("rarity_high_to_low")}
              >
                <span
                  className={`material-symbols-outlined icon fill ${
                    sortOption === "rarity_high_to_low" ? "active" : ""
                  }`}
                >
                  grade
                </span>
                <p
                  className={`option ${
                    sortOption === "rarity_high_to_low" ? "active" : ""
                  }`}
                >
                  Rarity from high to low
                </p>
              </div>
              <div
                className='option-box'
                onClick={() => setSortOption("rarity_low_to_high")}
              >
                <span
                  className={`material-symbols-outlined icon ${
                    sortOption === "rarity_low_to_high" ? "active" : ""
                  }`}
                >
                  grade
                </span>
                <p
                  className={`option ${
                    sortOption === "rarity_low_to_high" ? "active" : ""
                  }`}
                >
                  Rarity from low to high
                </p>
              </div>
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
    </>
  );
};

export default Sort;
