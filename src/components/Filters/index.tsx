import React, { useState } from "react";
import Rodal from "rodal";

import Button from "@/src/components/Button";
import PriceRanger from "@/src/components/PriceRanger";

import "rodal/lib/rodal.css";
import "./style.scss";

interface FiltersProps {}

const Filters: React.FC<FiltersProps> = () => {
  // Rodal
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        label=''
        icon='tune'
        className='btn-icon-transparent-28'
        onClick={show}
      />

      <Rodal
        visible={visible}
        onClose={hide}
        animation='slideUp'
        showCloseButton={false}
        customStyles={{ width: "100dvw", height: "70dvh" }}
      >
        <div className='container'>
          <h2 className='modal-title'>Filters</h2>
          <div className='content'>
            <PriceRanger maxValue={100} minValue={0} rangeTitle='Price Range' />
          </div>

          <Button
            label='Apply'
            className='btn-primary-50 icon'
            onClick={() => console.log("test")} // there should be logic for currency transfer
          />
        </div>
      </Rodal>
    </>
  );
};

export default Filters;
