import { User } from "@/src/utils/types";
import React from "react";
import iconObj from "@/public/icons/utils";
import Image from "next/image";
import "./style.scss";
import chicken from "@/public/chicken.png";
import ExchangeCurrency from "../ExchangeCurrency";
import ProgressBar from "../ProgressBar";

interface UserBalanceProps {
  user?: User;
  wss?: WebSocket
}

const UserBalance: React.FC<UserBalanceProps> = ({ user, wss }) => {
  //const staminaDelay = user.staminaDelay; // период добавления стамины
  const staminaDelay = 1000;
  const [userStamina, setUserStamina] = React.useState<number>(0);
  const staminaIntervals = React.useRef<{ timeOutId: any; intervalId: any }>({
    timeOutId: null,
    intervalId: null
  })
  const wssConnection = React.useRef(false);

  const increaseStamina = () => {
    staminaIntervals.current.intervalId = setInterval(() => {
      // user.increaseStamina();
      // setUserStamina(user.stamina);
    }, staminaDelay);
  }

  React.useEffect(() => {

    // wss.onopen = () => {
    //   wssConnection.current = true;
    //   increaseStamina();
    //   user.addPassiveStamina();
    //   setUserStamina(user.stamina);
    // }

    // wss.onerror = () => {
    //   wssConnection.current = false;
    // }
  }, []);

  React.useEffect(() => {
    if (!wssConnection.current) return;

    // wss.send(JSON.stringify({
    //   user_id: user.user_id,
    //   last_click: Date.now(),
    //   stamina: userStamina,
    //   balance_common: user.balance_common
    // }));
  }, [userStamina]);

  const clickerButtonHandler = () => {
    // func will return false if there is some error with balance increase
    // and true, if everything is okay
    // функция возвр-ает true\false, в зависимости от того, успешно ли было повышение баланса
    if (!user) return;

    if (staminaIntervals.current.timeOutId) clearTimeout(staminaIntervals.current.timeOutId);
    if (staminaIntervals.current.intervalId) clearInterval(staminaIntervals.current.intervalId);
    // user.increaseBallance(wss);
    // user.dereaseStamina();
    // user.balance_common += 1;
    setUserStamina(user.stamina);

    staminaIntervals.current.timeOutId = setTimeout(increaseStamina, 300);
  }

  return <>
    <div className="user-balance-container">
      <div className="user-balance">
        <p>Balance</p>
        {/* <h1>{user.balance_common.toLocaleString('ru-RU')} */}
        <h1>{(123123123).toLocaleString("ru-RU")}<Image
          src={iconObj.yellowCoin}
          width={16}
          height={16}
          alt='Purple coin'
        /></h1>
        <ExchangeCurrency />
        <h3>
          {/* {user.ballance_purple.toLocaleString('ru-RU')} */}
          {(123123123).toLocaleString("ru-RU")}
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
        {/* <p><span>Limit</span> <span>{user.stamina}/{user.max_stamina}</span></p> */}
        <p><span>Limit</span> <span>1000/1000</span></p>
        {/* <ProgressBar titleVisible={false} total={user.max_stamina} completed={user.stamina} /> */}
        <ProgressBar titleVisible={false} total={1000} completed={500} />
      </div>
    </div>
  </>
}

export default UserBalance;