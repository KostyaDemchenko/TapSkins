import React from "react";

import Float from "@/src/components/Float";
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
        btnTriggerIcon='tune'
        btnTriggerLabel=''
        btnTriggerClassName='btn-icon-transparent-28'
      >
        <div className='content'>
          <PriceRanger maxValue={100} minValue={0} rangeTitle='Price Range' />
          <Float floatValue={0.156548794165498} />
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
