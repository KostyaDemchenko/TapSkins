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
  skins: any[];
  onApply: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({
  minPrice,
  maxPrice,
  minFloat,
  maxFloat,
  skins,
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
  const [weapon, setWeapon] = useState<string[]>([]);
  const [rarity, setRarity] = useState<string[]>([]);
  const [starTrack, setStarTrack] = useState<boolean>(false);
  const [resetKey, setResetKey] = useState<number>(0);

  const [uniqueWeapons, setUniqueWeapons] = useState<string[]>([]);
  const [uniqueRarities, setUniqueRarities] = useState<string[]>([]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
    setFloatRange([minFloat, maxFloat]);

    const weapons = Array.from(new Set(skins.map((skin) => skin.weapon_name)));
    const rarities = Array.from(new Set(skins.map((skin) => skin.rarity)));

    setUniqueWeapons(weapons);
    setUniqueRarities(rarities);
  }, [minPrice, maxPrice, minFloat, maxFloat, skins]);

  const handleReset = () => {
    setPriceRange([minPrice, maxPrice]);
    setFloatRange([minFloat, maxFloat]);
    setWeapon([]);
    setStarTrack(false);
    setRarity([]);
    setResetKey((prevKey) => prevKey + 1);
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      floatRange,
      weapon,
      starTrack,
      rarity,
    };
    onApply(filters);
  };

  return (
    <>
      <Image
        src={iconObj.filters}
        width={24}
        height={24}
        alt='Filter'
        id='filtersModalTrigger'
      />
      <Modal
        modalTitle='Filters'
        triggerId='filtersModalTrigger'
        height='60dvh'
        closeElement={
          <Button
            label='Apply'
            className='btn-primary-50 icon'
            onClick={handleApply}
          />
        }
        modalBg='var(--color-background-secondary)'
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

          <div className='filter-option' id='weaponModalTrigger'>
            <p className='filter-title'>Weapon</p>
            <span className='material-symbols-outlined'>arrow_right_alt</span>
          </div>

          <Modal
            modalTitle='Weapon'
            triggerId='weaponModalTrigger'
            fade={false}
            subModal={true}
            height='60dvh'
            closeElement={
              <Button
                label='Apply'
                className='btn-primary-50 icon'
                onClick={handleApply}
              />
            }
            className='sub-filter-modal'
            modalBg='var(--color-background-secondary)'
          >
            <div className='content weapon filter-box'>
              {uniqueWeapons.map((weaponName) => (
                <div className='filter-option' key={weaponName}>
                  <CustomCheckbox
                    label={weaponName}
                    name={weaponName}
                    defaultChecked={weapon.includes(weaponName)}
                    onChange={(checked) => {
                      if (checked) {
                        setWeapon((prev) => [...prev, weaponName]);
                      } else {
                        setWeapon((prev) =>
                          prev.filter((item) => item !== weaponName)
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </Modal>

          <div className='filter-option'>
            <CustomRadioButton
              label={"StarTrack"}
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

          <div className='filter-option' id='rarityModalTrigger'>
            <p className='filter-title'>Rarity</p>
            <span className='material-symbols-outlined'>arrow_right_alt</span>
          </div>

          <Modal
            modalTitle='Rarity'
            triggerId='rarityModalTrigger'
            fade={false}
            subModal={true}
            height='60dvh'
            closeElement={
              <Button
                label='Apply'
                className='btn-primary-50 icon'
                onClick={handleApply}
              />
            }
            className='sub-filter-modal'
            modalBg='var(--color-background-secondary)'
          >
            <div className='content rarity filter-box'>
              {uniqueRarities.map((rarityName) => (
                <div className='filter-option' key={rarityName}>
                  <CustomCheckbox
                    label={rarityName}
                    name={rarityName}
                    colorBlock={true}
                    defaultChecked={rarity.includes(rarityName)}
                    onChange={(checked) => {
                      if (checked) {
                        setRarity((prev) => [...prev, rarityName]);
                      } else {
                        setRarity((prev) =>
                          prev.filter((item) => item !== rarityName)
                        );
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </Modal>

          <Button
            label='Reset'
            className='btn-tertiary-white-35'
            icon='refresh'
            onClick={handleReset}
          />
        </div>
      </Modal>
    </>
  );
};

export default Filters;
