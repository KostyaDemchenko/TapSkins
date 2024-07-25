import React, { useState } from "react";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";
import Image from "next/image";

import { User } from "@/src/utils/types";
import iconObj from "@/public/icons/utils";

import "./style.scss";

const ExchangeCurrency: React.FC<{ User: User | undefined }> = ({ User }) => {
  console.log(User);


  return (
    <>
      <div id="balance_exchange" className="material-symbols-outlined user-balance-exchange">
        swap_vert
      </div>
      <Modal
        modalTitle="Convert"
        triggerId="balance_exchange"
        closeElement={
          <Button
            label="Apply"
            className="btn-primary-50 icon"
            onClick={() => console.log("test")} // there should be logic for currency transfer
          />
        }
      >
        <p>Balance</p>
        <h1>{User ? <>{User.balance_common.toLocaleString('ru-RU')}</> : <>{(123123123).toLocaleString("ru-RU")}</>}<Image
          src={iconObj.yellowCoin}
          width={16}
          height={16}
          alt='Purple coin'
        /></h1>


        <div className="material-symbols-outlined user-balance-exchange">
          swap_vert
        </div>


        <p>To</p>
        <h1>{User ? <>{User.exchangeBallance()}</> : <>{(12000).toLocaleString("RU-ru")}</>}

          <Image
            src={iconObj.purpleCoin}
            width={16}
            height={16}
            alt='Purple coin'
          />
        </h1>
      </Modal>
    </>
  );
};

export default ExchangeCurrency;
