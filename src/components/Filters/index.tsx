import React, { useState } from "react";

import Float from "@/src/components/Float";
import CustomCheckbox from "@/src/components/Checkbox";
import CustomRadioButton from "@/src/components/RadioButton";
import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";
import PriceRanger from "@/src/components/PriceRanger";

import "rodal/lib/rodal.css";
import "./style.scss";

interface FiltersProps {}

const Filters: React.FC<FiltersProps> = () => {
  return (
    <>
      <Modal
        modalTitle='Filters'
        trigger={<button>Open Modal</button>}
        height='80dvh' // значение задавать только в dvh
      >
        <div className='content'>
          <PriceRanger maxValue={100} minValue={0} rangeTitle='Price Range' />
          <Float floatValue={0.156548794165498} />
          <CustomCheckbox name='custom-checkbox' />
          <CustomCheckbox name='custom-checkbo2' />
          <CustomRadioButton name='custom-radio' />
          <CustomRadioButton name='custom-radio1' />
        </div>

        <Button
          label='Apply'
          className='btn-primary-50 icon'
          onClick={() => console.log("test")} // there should be logic for currency transfer
        />
      </Modal>
    </>
  );
};

export default Filters;
