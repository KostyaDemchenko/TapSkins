import React from "react";
import Image from "next/image";

import ExchangeCurrency from "@/src/components/ExchangeCurrency";
import ProgressBar from "@/src/components/ProgressBar";

import iconObj from "@/public/icons/utils";
import imgObj from "@/public/img/utils";
import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import { SuccessDisplay, User } from "@/src/utils/types";

import "./style.scss";
import "react-toastify/dist/ReactToastify.css";

interface UserBalanceProps {
  user?: User;
  wss?: WebSocket;
}

const toastifyOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: false,
  progress: undefined,
  theme: "dark",
};

const UserBalance: React.FC<UserBalanceProps> = ({ user, wss }) => {
  // const staminaDelay = user.staminaDelay; // период добавления стамины
  const staminaDelay = user ? user.staminaDelay : 1000;
  const [userStamina, setUserStamina] = React.useState<number>(0);
  const staminaIntervals = React.useRef<{ timeOutId: any; intervalId: any }>({
    timeOutId: null,
    intervalId: null,
  });
  const [exchangeStatus, setExchangeStatus] =
    React.useState<SuccessDisplay | null>();
  const toastElement = React.useRef<Id>();

  const increaseStamina = () => {
    staminaIntervals.current.intervalId = setInterval(() => {
      if (!user) return;
      user.increaseStamina();
      setUserStamina(user.stamina);
    }, staminaDelay);
  };

  if (wss) {
    // при готовности соединения запускаем таймер на восстановление стамины
    React.useEffect(() => {
      if (!wss || !user) return;
      increaseStamina();
      user.addPassiveStamina();
      setUserStamina(user.stamina);
    }, [wss.readyState]);

    wss.onmessage = (e) => {
      const response = JSON.parse(e.data);

      if (!response.success) {
        console.error("Money wasn't increased");
      }
    };
  }

  // при изменении стамины, оптравляем изменения на бекенд
  React.useEffect(() => {
    if (!wss || !user || wss.readyState !== 1) return;
    wss.send(
      JSON.stringify({
        user_id: user.user_id,
        stamina: user.stamina,
        balance_common: user.getBalanceCommon(),
      })
    );
  }, [userStamina]);

  React.useEffect(() => {
    if (!exchangeStatus) return;

    if (exchangeStatus.loading && !exchangeStatus.success) {
      if (!toastElement.current) {
        toastElement.current = toast.loading("Exchanging...", toastifyOptions);
      } else {
        toast.update(toastElement.current, {
          ...toastifyOptions,
          isLoading: true,
          render: "Exchanging...",
        });
      }
    } else
      toast.update(toastElement.current!, {
        render: exchangeStatus.message,
        type: exchangeStatus.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
  }, [exchangeStatus]);

  React.useEffect(() => {
    if (user && user.receivedBonus) {
      if (!toastElement.current)
        toastElement.current = toast.success("You've received referal bonus!", {
          ...toastifyOptions,
          closeOnClick: true,
        });
      else
        toast.update(toastElement.current, {
          ...toastifyOptions,
          render: "You've received referal bonus!",
          type: "success",
          closeOnClick: true,
        });
    }
  }, []);

  const triggerVibration = (pattern: number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
    else {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_ADDRESS}/log?text='Vibration not supported'`)
    }
  };

  const clickerButtonHandler = () => {
    if (exchangeStatus?.loading) return;
    if (!user) return;

    if (staminaIntervals.current.timeOutId)
      clearTimeout(staminaIntervals.current.timeOutId);
    if (staminaIntervals.current.intervalId)
      clearInterval(staminaIntervals.current.intervalId);

    if (user && wss) {
      user.dereaseStamina();
      user.increaseBalance();
      setUserStamina(user.stamina);
    }

    staminaIntervals.current.timeOutId = setTimeout(increaseStamina, 300);

    // Вызов вибрации при нажатии на кнопку
    const randomPattern = [75];

    triggerVibration(randomPattern);
  };

  return (
    <>
      <div style={{ position: "absolute" }}>
        <ToastContainer />
      </div>
      <div className='user-balance-container'>
        <div className='user-balance'>
          <p>Balance</p>
          <h1>
            {user ? (
              <>{user.getBalanceCommon().toLocaleString("ru-RU")}</>
            ) : (
              <>{(0).toLocaleString("ru-RU")}</>
            )}
            <Image
              src={iconObj.yellowCoin}
              width={16}
              height={16}
              alt='Purple coin'
            />
          </h1>
          <ExchangeCurrency setExchangeStatus={setExchangeStatus} User={user} />
          <h3>
            {user ? (
              <>{user.getBalancePurple().toLocaleString("ru-RU")}</>
            ) : (
              <>{(0).toLocaleString("ru-RU")}</>
            )}
            <Image
              src={iconObj.purpleCoin}
              width={16}
              height={16}
              alt='Purple coin'
            />
          </h3>
        </div>
        <div className='clicker-button-container'>
          <div className='clicker-button-border'></div>
          <div className='clicker-button' onClick={clickerButtonHandler}>
            <Image
              src={imgObj.bomb}
              width={279}
              height={279}
              alt='bomb button'
            />
          </div>
        </div>
        <div className='stamina-info'>
          {user ? (
            <>
              <p>
                <span>Limit</span>{" "}
                <span>
                  {user.stamina}/{user.max_stamina}
                </span>
              </p>
              <ProgressBar
                titleVisible={false}
                total={user.max_stamina}
                completed={user.stamina}
              />
            </>
          ) : (
            <>
              <p>
                <span>Limit</span> <span>1000/1000</span>
              </p>
              <ProgressBar titleVisible={false} total={1000} completed={1000} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBalance;
