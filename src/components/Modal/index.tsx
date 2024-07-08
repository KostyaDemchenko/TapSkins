import React, { useState } from "react";

import Button from "@/src/components/Button";

import Rodal from "rodal";

import "rodal/lib/rodal.css";
import "./style.scss";

interface ModalProps {
  modalTitle: string;
  modalBtnText: string;
}

const Modal: React.FC<ModalProps> = ({ modalTitle, modalBtnText }) => {
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
        icon='swap_vert'
        className='btn-icon-28'
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
          <h2 className='modal-title'>Convert</h2>
          <div className='content'></div>

          <Button
            label='Convert'
            className='btn-primary-50 icon'
            onClick={() => console.log("test")} // there should be logic for currency transfer
          />
        </div>
      </Rodal>
    </>
  );
};

export default Modal;
