import React, { useState } from "react";
import { z } from "zod";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";

import "./style.scss";

// Validation schemas
const partnerSchema = z.string().regex(/^\d{9,}$/, {
  message: "Partner ID should be a number with at least 9 digits.",
});

const tokenSchema = z.string().regex(/^\w{8,}$/, {
  message: "Token should be alphanumeric with at least 8 characters.",
});

const urlSchema = z
  .string()
  .max(100, { message: "URL should be at most 100 characters long." }) // Ограничение на длину URL
  .refine(
    (url) => {
      const urlPattern =
        /^https:\/\/steamcommunity\.com\/tradeoffer\/new\/\?partner=(\d+)&token=(\w+)$/;
      const match = url.match(urlPattern);

      if (!match) return false;

      const [, partner, token] = match;

      try {
        partnerSchema.parse(partner);
        tokenSchema.parse(token);
        return true;
      } catch (e) {
        throw e;
      }
    },
    {
      message: "Invalid URL format. Please check the partner ID and token.",
    }
  );

const ValidationModal: React.FC<{
  triggerId: string;
  fade?: boolean;
  subModal?: boolean;
  onConfirm: () => void; // Теперь это просто функция подтверждения
}> = ({ triggerId, onConfirm, fade = true, subModal = false }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value === "") {
      setError(null);
      return;
    }

    try {
      urlSchema.parse(value);
      setError(null);
      localStorage.setItem("tradeLink", value); // Сохраняем в localStorage
    } catch (e: any) {
      const detailedError = e.errors
        ? e.errors.map((err: any) => err.message).join(" ")
        : "Invalid URL format. Please check the partner ID and token.";
      setError(detailedError);
    }
  };

  return (
    <Modal
      modalTitle='Enter Steam Trade Link'
      height='100dvh'
      triggerId={triggerId}
      className='validation-modal'
      fade={fade}
      subModal={subModal}
      closeElement={
        <Button
          label={`Confirm`}
          className='btn-primary-50'
          icon=''
          disabled={!!error || inputValue === ""}
          onClick={onConfirm} // Просто вызываем подтверждение
        />
      }
    >
      <p className='description'>
        Please enter your Steam Trade Link below. For help on how to find your
        Trade Link,{" "}
        <a
          href='https://steamcommunity.com/id/jpegcom/tradeoffers/privacy'
          target='_blank'
          rel='noopener noreferrer'
          className='link'
        >
          click here
        </a>
        .
      </p>

      <div
        className={`input-container ${
          error ? "input-error" : inputValue ? "input-success" : ""
        }`}
      >
        <input
          type='text'
          value={inputValue}
          onChange={handleChange}
          placeholder='Enter your Steam trade URL'
          className={`input-validation ${
            error ? "border-red" : inputValue ? "border-green" : ""
          }`}
        />
        {inputValue &&
          (error ? (
            <div className='icon-container'>
              <span className='material-symbols-rounded red'>info</span>
            </div>
          ) : (
            <div className='icon-container'>
              <span className='material-symbols-outlined green'>check</span>
            </div>
          ))}
        {error && inputValue && <p className={`error-message show`}>{error}</p>}
      </div>
    </Modal>
  );
};

export default ValidationModal;
