// давай реализуем сортировку
// Вот компонент сортироки и давай я объясню что значит "From low to high" по редкости
// 1) Common (тоесть самое простое)
// 2) Uncommon
// 3) Rare
// 4) Mythical
// 5) Legendary
// 6) Ancient
// 7) ExcedinglyRare (тоесть самое лучшее)

// эти параметры передаються в объекте скина в парматре "rarity"

import React, { useState } from "react";

import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";

import "./style.scss";

interface SortProps {
  onSort: (sortType: string, option: string, order: string) => void;
}

const Sort: React.FC<SortProps> = ({ onSort }) => {
  const [sortOptionPrice, setSortOptionPrice] = useState<string>("relevant");
  const [sortOrderPrice, setSortOrderPrice] = useState<string>("asc");
  const [sortOptionRarity, setSortOptionRarity] = useState<string>("relevant");
  const [sortOrderRarity, setSortOrderRarity] = useState<string>("asc");

  const handleApply = () => {
    onSort("price", sortOptionPrice, sortOrderPrice);
    onSort("rarity", sortOptionRarity, sortOrderRarity);
  };

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
              className={`option ${
                sortOptionPrice === "relevant" ? "active" : ""
              }`}
              onClick={() => setSortOptionPrice("relevant")}
            >
              Relevant
            </p>
            <p
              className={`option ${
                sortOptionPrice === "price" && sortOrderPrice === "desc"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSortOptionPrice("price");
                setSortOrderPrice("desc");
              }}
            >
              From low to high
            </p>
            <p
              className={`option ${
                sortOptionPrice === "price" && sortOrderPrice === "asc"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSortOptionPrice("price");
                setSortOrderPrice("asc");
              }}
            >
              From high to low
            </p>
          </div>
        </div>
        <div className='rarity-box'>
          <p className='title'>Rarity</p>
          <div className='options'>
            <p
              className={`option ${
                sortOptionRarity === "relevant" ? "active" : ""
              }`}
              onClick={() => setSortOptionRarity("relevant")}
            >
              Relevant
            </p>
            <p
              className={`option ${
                sortOptionRarity === "rarity" && sortOrderRarity === "desc"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSortOptionRarity("rarity");
                setSortOrderRarity("desc");
              }}
            >
              From low to high
            </p>
            <p
              className={`option ${
                sortOptionRarity === "rarity" && sortOrderRarity === "asc"
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSortOptionRarity("rarity");
                setSortOrderRarity("asc");
              }}
            >
              From high to low
            </p>
          </div>
        </div>
        <Button
          label='Reset'
          className='btn-tertiary-white-35'
          icon='refresh'
          onClick={() => {
            setSortOptionPrice("relevant");
            setSortOrderPrice("asc");
            setSortOptionRarity("relevant");
            setSortOrderRarity("asc");
          }}
        />
      </div>
    </Modal>
  );
};

export default Sort;
