import React, { useState } from "react";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";
import Image from "next/image";

import { SuccessDisplay, User } from "@/src/utils/types";
import iconObj from "@/public/icons/utils";

import "./style.scss";

interface ExchangeCurrencyProps {
  User: User | undefined;
  setExchangeStatus: (arg: SuccessDisplay) => void;
}

const ExchangeCurrency: React.FC<ExchangeCurrencyProps> = ({ User, setExchangeStatus }) => {
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
            disabled={User && User.getExchangeBallance() > 0 ? false : true}
            label="Apply"
            className="btn-primary-50 icon"
            onClick={async () => {
              const progressStatus: SuccessDisplay = {
                success: false,
                message: "Exchanging...",
                loading: true,
              };
              setExchangeStatus(progressStatus);

              setExchangeStatus(await User?.exchangeBallance()!);
            }}
          />
        }
      >
        <p>Balance</p>
        <h1>{User ? <>{User.getBalanceCommon().toLocaleString('ru-RU')}</> : <>{(123123123).toLocaleString("ru-RU")}</>}<Image
          src={iconObj.yellowCoin}
          width={16}
          height={16}
          alt='Purple coin'
        /></h1>


        <div className="material-symbols-outlined user-balance-exchange">
          swap_vert
        </div>


        <p>To</p>
        <h1>{User ? <>{User.getExchangeBallance()}</> : <>{(12000).toLocaleString("RU-ru")}</>}

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
