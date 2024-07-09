import React, { useState } from "react";
import Rodal from "rodal";

import Button from "@/src/components/Button";

import "rodal/lib/rodal.css";
import "./style.scss";

interface ModalProps {
  modalTitle: string;
  btnTriggerIcon?: string;
  btnTriggerLabel: string;
  btnTriggerClassName: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  modalTitle,
  btnTriggerIcon,
  btnTriggerLabel,
  btnTriggerClassName,
  children,
}) => {
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
        label={btnTriggerLabel}
        icon={btnTriggerIcon}
        className={btnTriggerClassName}
        onClick={show}
      />

      <Rodal
        visible={visible}
        onClose={hide}
        animation='slideUp'
        showCloseButton={false}
        customStyles={{ width: "100dvw", height: "70dvh" }}
      >
        <div className='modal-box'>
          <h2 className='modal-title'>{modalTitle}</h2>
          <div className='content'>{children}</div>
        </div>
      </Rodal>
    </>
  );
};

export default Modal;
