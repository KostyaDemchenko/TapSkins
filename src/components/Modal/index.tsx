import React, { useState, useRef, useEffect } from "react";
import "rodal/lib/rodal.css";
import "./style.scss";

interface ModalProps {
  modalTitle: string;
  btnTriggerIcon?: string;
  height?: string;
  className?: string;
  fade?: boolean;
  subModal?: boolean;
  trigger: React.ReactNode;
  children: React.ReactNode;
  closeElement?: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  modalTitle,
  trigger,
  children,
  className = "",
  height = "70dvh",
  onClose,
  fade = true,
  subModal = false,
  closeElement,
}) => {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState("100dvh");
  const modalRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({
    startY: 0,
    currentTop: 0,
    isDragging: false,
  });

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  const show = () => {
    const initialTop = 100 - parseFloat(height);
    setTop(`${initialTop}dvh`);
    setVisible(true);
  };

  const hide = () => {
    setTop("100dvh");
    setVisible(false);
    if (onClose) onClose();
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

    if (deltaY < 0) return;

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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      hide();
    }
  };

  return (
    <>
      <div className='modal-trigger' onClick={show}>
        {trigger}
      </div>

      <div
        className={`modal-background ${visible ? "show" : ""}`}
        onClick={handleClickOutside}
      >
        {fade && <div className='modal-fade' onClick={hide}></div>}
        <div
          ref={modalRef}
          className={className + " modal-dialog"}
          style={{ top, height }}
        >
          <div
            className='drag-zone'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          ></div>
          <div className='modal-box'>
            <div className='header-box'>
              {subModal && (
                <div className='back-btn' onClick={hide}>
                  <span className='material-symbols-outlined icon'>
                    keyboard_arrow_left
                  </span>
                </div>
              )}
              <h2 className='modal-title'>{modalTitle}</h2>
            </div>
            <div className='content'>{children}</div>
            <div className='modal-close' onClick={hide}>
              {closeElement}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
