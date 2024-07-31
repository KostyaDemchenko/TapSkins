import { SuccessDisplay, User } from "@/src/utils/types";
import React from "react";
import iconObj from "@/public/icons/utils";
import Image from "next/image";
import "./style.scss";
import chicken from "@/public/chicken.png";
import ExchangeCurrency from "../ExchangeCurrency";
import ProgressBar from "../ProgressBar";
import { Id, ToastContainer, ToastOptions, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface UserBalanceProps {
  user?: User;
  wss?: WebSocket;
}

const UserBalance: React.FC<UserBalanceProps> = ({ user, wss }) => {
  // const staminaDelay = user.staminaDelay; // период добавления стамины
  const staminaDelay = user ? user.staminaDelay : 1000;
  const [userStamina, setUserStamina] = React.useState<number>(0);
  const staminaIntervals = React.useRef<{ timeOutId: any; intervalId: any }>({
    timeOutId: null,
    intervalId: null
  });
  const [exchangeStatus, setExchangeStatus] = React.useState<SuccessDisplay | null>();
  const toastElement = React.useRef<Id>();

  const increaseStamina = () => {
    staminaIntervals.current.intervalId = setInterval(() => {
      if (!user) return;
      user.increaseStamina();
      setUserStamina(user.stamina);
    }, staminaDelay);
  }

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
      // if (response.success) {
      //   user?.setUser(response.newUser);
      //   setUserStamina(user!.stamina);
      // }

      // if (response.success) {
      //   const updatedUser = new User(tg!.initDataUnsafe.user!.id, tg!.initData);
      //   updatedUser.max_stamina = user.max_stamina;
      //   updatedUser.setUser(response.newUser);

      //   setUser(updatedUser);
      // } else {
      //   console.log("Money has not increased");
      // }
    };
  }

  React.useEffect(() => {
    const toastifyOptions: ToastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      progress: undefined,
      theme: "dark",
    }
    if (!user) return;
    const easterEgg = global.window.localStorage.getItem("easter-egg");
    if (easterEgg) return;
    if (user.user_id === 623165387 || user.user_id === 1334843022) {
      user.addBalance(1000000, 1000);
      toast.success("Саша привет!", toastifyOptions);
      global.window.localStorage.setItem("easter-egg", "1");
    }
  }, [user])

  // при изменении стамины, оптравляем изменения на бекенд
  React.useEffect(() => {
    if (!wss || !user || wss.readyState !== 1) return;
    wss.send(JSON.stringify({
      user_id: user.user_id,
      stamina: user.stamina,
      balance_common: user.getBalanceCommon()
    }));
  }, [userStamina]);

  React.useEffect(() => {
    const toastifyOptions: ToastOptions = {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      progress: undefined,
      theme: "dark",
    }
    if (!exchangeStatus) return;

    if (exchangeStatus.loading && !exchangeStatus.success) toastElement.current = toast.loading("Exchanging...", toastifyOptions);
    else toast.update(toastElement.current!, {
      render: exchangeStatus.message,
      type: exchangeStatus.success ? "success" : "error",
      isLoading: false,
      autoClose: 3000,
      pauseOnHover: false,
      closeOnClick: true
    });


  }, [exchangeStatus]);

  const clickerButtonHandler = () => {
    if (exchangeStatus?.loading) return;
    if (!user) return;

    if (staminaIntervals.current.timeOutId) clearTimeout(staminaIntervals.current.timeOutId);
    if (staminaIntervals.current.intervalId) clearInterval(staminaIntervals.current.intervalId);

    if (user && wss) {
      user.dereaseStamina();
      user.increaseBalance();
      setUserStamina(user.stamina);
    }

    staminaIntervals.current.timeOutId = setTimeout(increaseStamina, 300);
  }

  return <>
    <div style={{ position: "absolute" }}>
      <ToastContainer />
    </div>
    <div className="user-balance-container">
      <div className="user-balance">
        <p>Balance</p>
        <h1>{user ? <>{user.getBalanceCommon().toLocaleString('ru-RU')}</> : <>{(0).toLocaleString("ru-RU")}</>}<Image
          src={iconObj.yellowCoin}
          width={16}
          height={16}
          alt='Purple coin'
        /></h1>
        <ExchangeCurrency setExchangeStatus={setExchangeStatus} User={user} />
        <h3>
          {user ? <>{user.getBalancePurple().toLocaleString('ru-RU')}</>
            :
            <>{(0).toLocaleString("ru-RU")}</>}
          <Image
            src={iconObj.purpleCoin}
            width={16}
            height={16}
            alt='Purple coin'
          /></h3>
      </div>
      <div className="clicker-button-container">
        <div className="clicker-button-border"></div>
        <div className="clicker-button" onClick={clickerButtonHandler}>
          <img src={chicken.src} alt="Picture" />
        </div>
      </div>
      <div className="stamina-info">
        {user ? <>
          <p><span>Limit</span> <span>{user.stamina}/{user.max_stamina}</span></p>
          <ProgressBar titleVisible={false} total={user.max_stamina} completed={user.stamina} />
        </>
          :
          <>
            <p><span>Limit</span> <span>1000/1000</span></p>
            <ProgressBar titleVisible={false} total={1000} completed={1000} />
          </>
        }
      </div>
    </div>
  </>
}

export default UserBalance;