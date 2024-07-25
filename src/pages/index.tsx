import React, { useState } from "react";
import Script from "next/script";

import Nav from "@/src/components/Nav";
import { User } from "../utils/types";

import "@/src/app/globals.scss";
import UserBalance from "../components/UserBalance";

const webSocketAddress = process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!;

export default function Home() {
  const [tg, setTg] = React.useState<WebApp | null>();
  // нужно добавить еще одно состояние, undefined, которое бы значило что аворизация провалилась
  // null - еще пользователя нету, то есть был послан запрос с авторизацией
  const [user, setUser] = React.useState<User | null>(null);
  // boolean - подписан\неподписан
  // undefined - еще ничего не отправлено
  // null - ошибка какая-то
  const [userSubscribed, setUserSubscribed] = React.useState<
    boolean | null | undefined
  >(undefined);
  const wss = React.useRef<null | WebSocket>(null);
  const [isWsConnected, setIsWsConnected] = useState<boolean>(false);

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
    })();
  }, [tg]);

  React.useEffect(() => {
    try {
      console.log("Connecting...");
      const ws = new WebSocket(webSocketAddress);
      wss.current = ws;
      ws.onopen = () => {
        console.log("Connected");
        setIsWsConnected(true);
      }
    } catch (e) {
      console.error(e);
    }
  
    //? при отправке сообщения с бекенда по вебсокету
    if (user && wss.current) {
      wss.current.onclose = (event) => {
        console.log(
          `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
        );
      };
      wss.current.onmessage = (e) => {
        const response = JSON.parse(e.data);
  
        if (response.success) {
          const updatedUser = new User(tg!.initDataUnsafe.user!.id);
          updatedUser.max_stamina = user.max_stamina;
          updatedUser.setUser(response.newUser);
  
          setUser(updatedUser);
        } else {
          console.log("Money has not increased");
        }
      };
    }
  }, [wss.current]);
  

  const getSubsMsg = () => {
    switch (true) {
      case userSubscribed === undefined:
        return "Check if you are subscribed";
      case userSubscribed === null:
        console.log("error");
        return "Error :(";
      case userSubscribed:
        console.log("yes");
        return "Yes, you are!";
      case !userSubscribed:
        console.log("no");
        return "No, you aren't :(";
      default:
        return "Some error occured :(";
    }
  };

  return (
    <>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      <main
        style={{
          display: "flex",
          gap: "15px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {!user && <UserBalance />}
        {user && wss.current && <UserBalance wsIsConnected={isWsConnected} user={user} wss={wss.current} />}
      </main>
      <Nav />
    </>
  );
}
