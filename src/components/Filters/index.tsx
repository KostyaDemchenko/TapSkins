import React, { useState, useEffect } from "react";
import Image from "next/image";

import Button from "@/src/components/Button";
import CustomCheckbox from "@/src/components/Checkbox";
import CustomRadioButton from "@/src/components/RadioButton";
import Modal from "@/src/components/Modal";
import PriceRanger from "@/src/components/PriceRanger";

import iconObj from "@/public/icons/utils";

import "rodal/lib/rodal.css";
import "./style.scss";

interface FiltersProps {
  minPrice: number;
  maxPrice: number;
  minFloat: number;
  maxFloat: number;
  onApply: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({
  minPrice,
  maxPrice,
  minFloat,
  maxFloat,
  onApply,
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice,
    maxPrice,
  ]);
  const [floatRange, setFloatRange] = useState<[number, number]>([
    minFloat,
    maxFloat,
  ]);
  const [weaponType, setWeaponType] = useState<string | null>(null);
  const [weapon, setWeapon] = useState<string | null>(null);
  const [starTrack, setStarTrack] = useState<boolean>(false);
  const [rarity, setRarity] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState<number>(0);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setFloatRange([minFloat, maxFloat]);
  }, [minPrice, maxPrice, minFloat, maxFloat]);

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setFloatRange([minFloat, maxFloat]);
    setWeaponType(null);
    setWeapon(null);
    setStarTrack(false);
    setRarity(null);
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      floatRange,
      weaponType,
      weapon,
      starTrack,
      rarity,
    };
    onApply(filters);
  };

  return (
    <Modal
      modalTitle='Filters'
      trigger={
        <Image src={iconObj.filters} width={24} height={24} alt='Filter' />
      }
      height='60dvh'
      closeElement={
        <Button
          label='Apply'
          className='btn-primary-50 icon'
          onClick={() => {
            handleApply();
          }}
        />
      }
    >
      <div className='content filter-box'>
        <PriceRanger
          key={`price-${resetKey}`}
          maxValue={maxPrice}
          minValue={minPrice}
          icons={true}
          rangeTitle='Price'
          onChange={setPriceRange}
          step={1}
        />
        <div className='filter-option'>
          <p className='filter-title'>Weapon type</p>
          <span className='material-symbols-outlined'>arrow_right_alt</span>
        </div>
        <div className='filter-option'>
          <p className='filter-title'>Weapon</p>
          <span className='material-symbols-outlined'>arrow_right_alt</span>
        </div>
        <div className='filter-option'>
          <p className='filter-title'>StarTrack</p>
          <CustomRadioButton
            name='startrack'
            defaultSelected={starTrack}
            onChange={setStarTrack}
          />
        </div>
        <PriceRanger
          key={`float-${resetKey}`}
          maxValue={maxFloat}
          minValue={minFloat}
          icons={false}
          rangeTitle='Float'
          onChange={setFloatRange}
          step={0.0001}
        />
        <div className='filter-option'>
          <p className='filter-title'>Rarity</p>
          <span className='material-symbols-outlined'>arrow_right_alt</span>
        </div>

        <Button
          label='Reset'
          className='btn-tertiary-white-35'
          icon='refresh'
          onClick={handleReset}
        />
      </div>
    </Modal>
  );
};

export default Filters;
