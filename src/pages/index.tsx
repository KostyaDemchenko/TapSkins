import React from "react";
import Script from "next/script";

import Button from "@/src/components/Button";
import Filters from "@/src/components/Filters";
import Nav from "@/src/components/Nav";
import { User } from "../utils/types";

import "@/src/app/globals.scss";
import { logs } from "../utils/functions";

export default function Home() {
  const [tg, setTg] = React.useState<WebApp | null>();
  // нужно добавить еще одно состояние, undefined, которое бы значило что аворизация провалилась
  // null - еще пользователя нету, то есть был послан запрос с авторизацией
  const [user, setUser] = React.useState<User | null>(null);
  // boolean - подписан\неподписан
  // undefined - еще ничего не отправлено
  // null - ошибка какая-то
  const [userSubscribed, setUserSubscribed] = React.useState<boolean | null | undefined>(undefined);

  React.useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");


    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id);
      const response = await userClass.authUser(tg);

      // пока не будет это выполнено, никаких нахуй дальше действий
      if (response) setUser(userClass);
    })()
  }, [tg]);

  const wss = new WebSocket("ws://localhost:8081");

  wss.onopen = () => {
    console.log("Connected!");
  };

  wss.onerror = (error) => {
    console.log("Error", error);
  };

  wss.onclose = (event) => {
    console.log(
      `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
    );
  };

  if (user) {
    wss.onmessage = (e) => {
      const response = JSON.parse(e.data);

      if (response.success) {
        const updatedUser = new User(response.newUser.id);
        updatedUser.setUser(response.newUser);
        setUser(updatedUser);
      }
      else {
        console.log("Money has not increased");
      }
    }
  }

  const getSubsMsg = () => {
    switch(true) {
      case userSubscribed === undefined: return "Check if you are subscribed";
      case userSubscribed === null: return "Error :(";
      case userSubscribed: return "Yes, you are!";
      case !userSubscribed: return "No, you aren't :(";
      default: return "Some error occured :(";
    }
  }

  return (
    <>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      <main>
        <Button
          label={`Buy it now, ${tg?.initDataUnsafe?.user?.first_name}`}
          className='btn-primary-50 icon'
          onClick={() => console.log("test")}
        />
        <Button
          label={`I know your id. ${tg?.initDataUnsafe?.user?.id}`}
          className='btn-primary-50 icon'
          icon='shopping_cart'
          onClick={() => console.log("test")}
        />

        <Button
          label={`Your platform: ${tg?.platform}`}
          className='btn-primary-50 icon'
          icon='shopping_cart'
          onClick={() => console.log("test")}
        />
        <span style={{
          color: "white"
        }}>
          {!user && "Error occured :("}
        </span>

        <Button label={`Increase user money: ${user ? user.balance_common : "no user"}`} className="btn-primary-50 icon"
          onClick={() => {
            // this will be an imitation of clicking chicken
            // func will return false if there is some error with balance increase
            // and true, if everything is okay
            if (!user) return;
            user.increaseBallance(wss);
          }} />

        <span style={{
          color: "white"
        }}>
          {!user && "Error occured :("}
          {user && `Stamina: ${user.stamina}/1000`}
        </span>

        <Button label={getSubsMsg()} className="btn-primary-50 icon" onClick={async () => {
          if (!user) return;
          // первый аргумент - айди пользователя, второй - телеграм id
          const subscribed = (await user.checkSubscription("@OutTestChanel") as boolean | null);
          setUserSubscribed(subscribed);
        }} />
        <Filters />
      </main>
      <Nav />
    </>
  );
}
