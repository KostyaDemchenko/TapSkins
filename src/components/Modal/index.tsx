import React, { useState, useRef } from "react";
import "rodal/lib/rodal.css";
import "./style.scss";

interface ModalProps {
  modalTitle: string;
  btnTriggerIcon?: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  height?: string; // new prop for custom height
}

const Modal: React.FC<ModalProps> = ({
  modalTitle,
  btnTriggerIcon,
  trigger,
  children,
  height = "70dvh", // default value
}) => {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState("100dvh");
  const positionRef = useRef({
    startY: 0,
    currentTop: 0,
    isDragging: false,
  });

  const show = () => {
    const initialTop = 100 - parseFloat(height);
    setTop(`${initialTop}dvh`);
    setVisible(true);
  };

  const hide = () => {
    setTop("100dvh");
    setVisible(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const element = e.currentTarget.closest(".modal-dialog") as HTMLDivElement;
    const initialTop = element.getBoundingClientRect().top;

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

    if (deltaY < 0) return; // Ignore upward movements

    setTop(`${positionRef.current.currentTop + deltaY}px`);
  };

  const handleTouchEnd = () => {
    positionRef.current.isDragging = false;

    if (parseInt(top) > window.innerHeight * 0.5) {
      hide();
    } else {
      setTop(`${100 - parseFloat(height)}dvh`);
    }
  };

  return (
    <>
      <div onClick={show}>{trigger}</div>

      <div className={`modal-background ${visible ? "show" : ""}`}>
        <div className='modal-fade' onClick={hide}></div>

        <div className='modal-dialog' style={{ top, height }}>
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
