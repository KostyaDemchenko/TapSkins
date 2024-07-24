import React, { useState, useEffect, useRef } from "react";

import { createPortal } from "react-dom";
import "rodal/lib/rodal.css";
import "./style.scss";

interface ModalProps {
  modalTitle: string;
  triggerId: string;
  height?: string;
  className?: string;
  modalBg?: string;
  fade?: boolean;
  subModal?: boolean;
  children: React.ReactNode;
  closeElement?: React.ReactNode;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  modalTitle,
  triggerId,
  children,
  className = "",
  height = "70dvh",
  onClose,
  fade = true,
  subModal = false,
  closeElement,
  modalBg = "var(--color-surface)",
}) => {
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState("100dvh");
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const triggerElement = document.getElementById(triggerId);
    if (triggerElement) {
      triggerElement.addEventListener("click", show);
    }

    return () => {
      setMounted(false);
      if (triggerElement) {
        triggerElement.removeEventListener("click", show);
      }
    };
  }, [triggerId]);

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

  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      hide();
    }
  };

  const modalContent = (
    <div
      className={`modal-background ${visible ? "show" : ""}`}
      onClick={handleClickOutside}
    >
      {fade && <div className='modal-fade' onClick={hide}></div>}
      <div
        ref={modalRef}
        className={className + " modal-dialog"}
        style={{ top, height, backgroundColor: modalBg }}
      >
        <div className='drag-zone'></div>
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
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default Modal;
