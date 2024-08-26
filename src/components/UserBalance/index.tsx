import React, { useRef } from "react";
import Image from "next/image";

import ExchangeCurrency from "@/src/components/ExchangeCurrency";
import ProgressBar from "@/src/components/ProgressBar";

import iconObj from "@/public/icons/utils";
import imgObj from "@/public/img/utils";
import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import { SuccessDisplay, User } from "@/src/utils/types";
import Skeleton from "@mui/material/Skeleton";

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

const calculateStamina = (last_click: number) => {
  const current_time = Date.now();
  const difTime = Math.abs(current_time - last_click);
  const passiveStamina = Math.floor(difTime / 1000) * 3;
  return passiveStamina;
};

const useStamina = (user: User | undefined, wss: WebSocket | undefined) => {
  const [stamina, setStamina] = React.useState<number>(user ? user.stamina : 0);

  React.useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      if (wss && wss.readyState === wss.OPEN) {
        wss.send(JSON.stringify({
          type: "stamina",
          user: user.getInitData()
        }));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [user, wss]);

  return [stamina, setStamina] as const;
};

const UserBalance: React.FC<UserBalanceProps> = ({ user, wss }) => {
  const [stamina, setStamina] = useStamina(user, wss);
  const [exchangeStatus, setExchangeStatus] =
    React.useState<SuccessDisplay | null>();
  const toastElement = React.useRef<Id>();
  const [tiltStyle, setTiltStyle] = React.useState<{ transform: string }>({
    transform: "none",
  });

  React.useEffect(() => {
    if (!wss || wss.readyState !== wss.OPEN) return;
    wss.onmessage = (e) => {
      const response = JSON.parse(e.data);
      console.log("Receiving...", response);
      if (response.success && user) {
        user.stamina = Math.min(response.stamina + calculateStamina(response.last_click), user.max_stamina);
        user.last_click = response.last_click;
        setStamina(Math.min(response.stamina + calculateStamina(response.last_click), user.max_stamina));
      } else {
        console.error("Money wasn't increased");
        if (response.details) {
          console.error(response.details);
        }
        toast.error(response.message, toastifyOptions);
      }
    };
  }, [wss, user, setStamina]);

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
    } else {
      toast.update(toastElement.current!, {
        render: exchangeStatus.message,
        type: exchangeStatus.success ? "success" : "error",
        isLoading: false,
        autoClose: 3000,
        pauseOnHover: false,
        closeOnClick: true,
      });
    }
  }, [exchangeStatus]);

  React.useEffect(() => {
    if (user && user.receivedBonus) {
      if (!toastElement.current)
        toastElement.current = toast.success(
          "You've received referral bonus!",
          {
            ...toastifyOptions,
            closeOnClick: true,
          }
        );
      else
        toast.update(toastElement.current, {
          ...toastifyOptions,
          render: "You've received referral bonus!",
          type: "success",
          closeOnClick: true,
        });
    }
  }, [user]);

  const triggerHapticFeedback = (style: "light" | "medium" | "heavy") => {
    try {
      // Используем Telegram Web App Haptic Feedback для iOS
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style);

      // Используем стандартную вибрацию для Android, если доступна
      if (navigator.vibrate) {
        navigator.vibrate(50); // Вибрация на 50 мс
      } else {
        console.warn("Vibration API not supported");
      }
    } catch (err) {
      console.error("Haptic feedback is not available", err);
    }
  };

  const clickerButtonHandler = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!user) return;
    if (exchangeStatus && exchangeStatus.loading) return;


    // Используем легкое тактильное воздействие при нажатии
    triggerHapticFeedback("medium");
    if (user && wss) {
      if (wss.readyState === wss.CONNECTING) {
        toast.error("Connecting...please wait", toastifyOptions);
        console.log("Still connecting with websocket");
        return;
      }
      user.increaseBalance();
      wss.send(
        JSON.stringify({
          user: user.getInitData(),
        })
      );
    }
  };

  const touchEnd = () => {
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
    const angleX = (deltaY / rect.height) * 50;
    const angleY = -(deltaX / rect.width) * 50;

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
                priority
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
                  {stamina}/{user.max_stamina}
                </span>
              </p>
              <ProgressBar
                titleVisible={false}
                total={user.max_stamina}
                completed={stamina}
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
