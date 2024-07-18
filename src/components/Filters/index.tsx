import React, { useState } from "react";
import Image from "next/image";

import Button from "@/src/components/Button";
import CustomCheckbox from "@/src/components/Checkbox";
import CustomRadioButton from "@/src/components/RadioButton";
import Modal from "@/src/components/Modal";
import PriceRanger from "@/src/components/PriceRanger";

import iconObj from "@/public/icons/utils";

import "rodal/lib/rodal.css";
import "./style.scss";

interface FiltersProps {}

const Filters: React.FC<FiltersProps> = () => {
  return (
    <>
      <Modal
        modalTitle='Filters'
        trigger={
          <Image src={iconObj.filters} width={24} height={24} alt='Filter' />
        }
        height='60dvh'
      >
        <div className='content'>
          <PriceRanger
            maxValue={100}
            minValue={0}
            icons={true}
            rangeTitle='Price'
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
            <CustomRadioButton name='startrack' />
          </div>
          <PriceRanger
            maxValue={100}
            minValue={0}
            icons={false}
            rangeTitle='Float'
          />
          <div className='filter-option'>
            <p className='filter-title'>Rarity</p>
            <span className='material-symbols-outlined'>arrow_right_alt</span>
          </div>

          <Button
            label='Reset'
            className='btn-tertiary-white-35'
            icon='refresh'
          />
        </div>

        <Button
          label='Apply'
          className='btn-primary-50 icon'
          onClick={() => console.log("test")}
        />
      </Modal>
    </>
  );
};

export default Filters;
