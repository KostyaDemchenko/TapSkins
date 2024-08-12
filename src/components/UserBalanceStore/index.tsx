import React from "react";
import Image from "next/image";

import Button from "@/src/components/Button";
import iconObj from "@/public/icons/utils";
import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import { SuccessDisplay, User } from "@/src/utils/types";
import Modal from "../Modal";

import "./style.scss";
import { Skeleton } from "@mui/material";

interface userBalanceStoreProps {
  user?: User;
}

const userBalanceStore: React.FC<userBalanceStoreProps> = ({ user }) => {
  const [exchangeStatus, setExchangeStatus] =
    React.useState<SuccessDisplay | null>();
  const toastElement = React.useRef<Id>();

  React.useEffect(() => {
    const toastifyOptions: ToastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      progress: undefined,
      theme: "dark",
    };
    if (!exchangeStatus) return;

    if (exchangeStatus.loading && !exchangeStatus.success)
      toastElement.current = toast.loading("Exchanging...", toastifyOptions);
    else
      toast.update(toastElement.current!, {
        render: exchangeStatus.message,
        type: exchangeStatus.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
  }, [exchangeStatus]);

  return (
    <div className='user-balance'>
      <div className='balance-box'>
        <p className='title'>Balance</p>
        <div className='amount'>
          <p className='balance'>
            {user ? user.getBalancePurple().toLocaleString("RU-ru") : <Skeleton
              variant='rounded'
              width={24}
              height={24}
              animation='wave'
              sx={{ bgcolor: "var(--color-surface)" }}
            />}
          </p>
          <Image src={iconObj.purpleCoin} alt='Purple Coin' />
        </div>
      </div>
      <Button
        label='Convert'
        id='balance_exchange'
        className='btn-secondary-25'
      />
      <Modal
        className='exchange-modal'
        modalTitle='Convert'
        height='60dvh'
        triggerId='balance_exchange'
        closeElement={
          <Button
            disabled={user && user.getExchangeBallance() > 0 ? false : true}
            label='Apply'
            className='btn-primary-50 icon'
            onClick={async () => {
              const progressStatus: SuccessDisplay = {
                success: false,
                message: "Exchanging...",
                loading: true,
              };
              setExchangeStatus(progressStatus);

              setExchangeStatus(await user?.exchangeBallance()!);
            }}
          />
        }
      >
        <p>Balance</p>
        <h1>
          {user ? (
            <>{user.getBalanceCommon().toLocaleString("ru-RU")}</>
          ) : (
            <>{(123123123).toLocaleString("ru-RU")}</>
          )}
          <Image
            src={iconObj.yellowCoin}
            width={16}
            height={16}
            alt='Purple coin'
          />
        </h1>

        <div className='material-symbols-outlined user-balance-exchange'>
          swap_vert
        </div>

        <p>To</p>
        <h1>
          {user ? (
            <>{user.getExchangeBallance()}</>
          ) : (
            <>{(12000).toLocaleString("RU-ru")}</>
          )}

          <Image
            src={iconObj.purpleCoin}
            width={16}
            height={16}
            alt='Purple coin'
          />
        </h1>
      </Modal>
    </div>
  );
};

export default userBalanceStore;
