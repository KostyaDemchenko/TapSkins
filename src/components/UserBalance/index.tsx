import React, { useRef } from "react";
import Image from "next/image";

import ExchangeCurrency from "@/src/components/ExchangeCurrency";
import ProgressBar from "@/src/components/ProgressBar";

import iconObj from "@/public/icons/utils";
import imgObj from "@/public/img/utils";
import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import { SuccessDisplay, User } from "@/src/utils/types";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import Skeleton from "@mui/material/Skeleton"; // Импортируем компонент Skeleton

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
  const staminaDelay = user ? user.staminaDelay : 1000;
  const [userStamina, setUserStamina] = React.useState<number>(0);
  const staminaIntervals = React.useRef<{ timeOutId: any; intervalId: any }>({
    timeOutId: null,
    intervalId: null,
  });
  const [exchangeStatus, setExchangeStatus] =
    React.useState<SuccessDisplay | null>();
  const toastElement = React.useRef<Id>();
  const [tiltStyle, setTiltStyle] = React.useState<{ transform: string }>({
    transform: "none",
  });

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

  const triggerHapticFeedback = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (err) {
      console.error("Haptic feedback is not available", err);
    }
  };

  const clickerButtonHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
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
    triggerHapticFeedback();
  };

  const touchEnd = () => {
    console.log("up...");
    setTiltStyle({ transform: `rotateX(${0}deg) rotateY(${0}deg)` });
  };

  const touchStart = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>
  ) => {
    const event = e as
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>;
    const isTouch = event.type === "touchstart";

    const clientX = isTouch
      ? (event as React.TouchEvent<HTMLDivElement>).touches[0].clientX
      : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientX;
    const clientY = isTouch
      ? (event as React.TouchEvent<HTMLDivElement>).touches[0].clientY
      : (event as React.MouseEvent<HTMLDivElement, MouseEvent>).clientY;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const angleX = (deltaY / rect.height) * 30; // Control the intensity of the tilt
    const angleY = -(deltaX / rect.width) * 30; // Control the intensity of the tilt

    setTiltStyle({ transform: `rotateX(${angleX}deg) rotateY(${angleY}deg)` });
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
              <>
                {user.getBalanceCommon().toLocaleString("ru-RU")}
                <Image
                  src={iconObj.yellowCoin}
                  width={16}
                  height={16}
                  alt='Yellow coin'
                />
              </>
            ) : (
              <Skeleton
                variant='rectangular'
                height={25}
                width={250}
                animation='wave'
                sx={{
                  bgcolor: "var(--color-surface)",
                  marginBottom: "5px",
                  width: "100%",
                }}
              />
            )}
          </h1>
          <ExchangeCurrency setExchangeStatus={setExchangeStatus} User={user} />
          <h3>
            {user ? (
              <>
                {user.getBalancePurple().toLocaleString("ru-RU")}
                <Image
                  src={iconObj.purpleCoin}
                  width={16}
                  height={16}
                  alt='Purple coin'
                />
              </>
            ) : (
              <Skeleton
                variant='rectangular'
                height={25}
                width={150}
                animation='wave'
                sx={{
                  bgcolor: "var(--color-surface)",
                  marginBottom: "5px",
                  width: "100%",
                }}
              />
            )}
          </h3>
        </div>
        <div
          className='clicker-button-container'
          onTouchStart={touchStart}
          onTouchEnd={touchEnd}
          style={tiltStyle}
          onClick={clickerButtonHandler}
        >
          <div className='clicker-button-border'></div>
          <div className='clicker-button'>
            {user ? (
              <Image
                src={imgObj.bomb}
                width={279}
                height={279}
                alt='bomb button'
              />
            ) : (
              <Skeleton
                variant='circular'
                width={279}
                height={279}
                animation='wave'
                sx={{
                  bgcolor: "var(--color-surface)",
                }}
              />
            )}
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
              <Skeleton width={100} height={20} />{" "}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserBalance;
