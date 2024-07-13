import { User, UserObj } from "@/src/utils/types";
import React from "react";
import Button from "../Button";
import { logs } from "@/src/utils/functions";

interface UserBalanceProps {
  user: User;
  wss: WebSocket
}

const UserBalance: React.FC<UserBalanceProps> = ({ user, wss }) => {
  // const refStamina = React.useRef(user.stamina);
  const staminaDelay = 1000; // период добавления стамины
  const [userStamina, setUserStamina] = React.useState<number>(user.stamina);
  const staminaIntervals = React.useRef<{ timeOutId: any; intervalId: any }>({
    timeOutId: null,
    intervalId: null
  })
  const wssConnection = React.useRef(false);

  const increaseStamina = () => {
    staminaIntervals.current.intervalId = setInterval(() => {
      user.increaseStamina();
      setUserStamina(user.stamina);
    }, staminaDelay);
  }

  React.useEffect(() => {
    
    wss.onopen = () => {
      wssConnection.current = true;
      increaseStamina();
      user.addPassiveStamina();
      setUserStamina(user.stamina);
    }

    wss.onerror = () => {
      wssConnection.current = false;
    }
  }, []);

  React.useEffect(() => {
    if (!wssConnection.current) return;

    wss.send(JSON.stringify({
      user_id: user.user_id,
      last_click: Date.now(),
      stamina: userStamina,
      balance_common: user.balance_common
    }));
  }, [userStamina]);

  return <>
    <span style={{
      color: "white"
    }}>
      {!user && "Error occured :("}
      {user && `Stamina: ${userStamina}/${user.max_stamina}`}
    </span>
    <Button label={`Increase user money: ${user ? user.balance_common : "no user"}`} className="btn-primary-50 icon"
      onClick={() => {
        // this will be an imitation of clicking chicken
        // func will return false if there is some error with balance increase
        // and true, if everything is okay
        // функция возвр-ает true\false, в зависимости от того, успешно ли было повышение баланса
        if (!user) return;

        if (staminaIntervals.current.timeOutId) clearTimeout(staminaIntervals.current.timeOutId);
        if (staminaIntervals.current.intervalId) clearInterval(staminaIntervals.current.intervalId);
        // user.increaseBallance(wss);
        user.dereaseStamina();
        user.balance_common += 1;
        setUserStamina(user.stamina);

        staminaIntervals.current.timeOutId = setTimeout(increaseStamina, 300);
      }} />
  </>
}

export default UserBalance;