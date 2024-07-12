import React, { useState, useRef } from "react";
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
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState("100%");
  const positionRef = useRef({
    startY: 0,
    currentTop: 0,
    isDragging: false,
  });

  const show = () => {
    setTop("30vh");
    setVisible(true);
  };

  const hide = () => {
    setTop("100%");
    setVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const element = e.currentTarget.closest(".modal-dialog") as HTMLDivElement;
    const initialTop = element.offsetTop;

    positionRef.current = {
      startY: e.touches[0].clientY,
      currentTop: initialTop,
      isDragging: true,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!positionRef.current.isDragging) return;

    const { clientY } = e.touches[0];
    const deltaY = clientY - positionRef.current.startY;

    if (deltaY < 0) return; // Игнорируем движения вверх

    setTop(`${positionRef.current.currentTop + deltaY}px`);
  };

  const handleTouchEnd = () => {
    positionRef.current.isDragging = false;

    if (parseInt(top) > window.innerHeight * 0.5) {
      hide();
    } else {
      setTop("30vh");
    }
  };

  return (
    <>
      <Button
        label={btnTriggerLabel}
        icon={btnTriggerIcon}
        className={btnTriggerClassName}
        onClick={show}
      />

      <div className={`modal-background ${visible ? "show" : ""}`}>
        <div className='modal-fade' onClick={hide}></div>

        <div className='modal-dialog' style={{ top }}>
          <div
            className='drag-zone'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          ></div>
          <div className='modal-box'>
            <h2 className='modal-title'>{modalTitle}</h2>
            <div className='content'>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
