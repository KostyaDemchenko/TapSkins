import React from "react";
import Script from "next/script";

import Button from "@/src/components/Button";
import Filters from "@/src/components/Filters";
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


  try {
    const ws = new WebSocket(webSocketAddress);
    wss.current = ws;
  }
  catch(e) {
    console.error(e);
  }

  //? при отправке сообщения с бекенда по вебсокету
  if (user && wss.current) {

    const wssCallbacks = () => {
      if (!wss.current) return;
      wss.current.onopen = () => {
        if (!user) return;
        // console.log("Connected!");
      };

      wss.current.onerror = (error) => {
        console.log("Error", error);
      };

      wss.current.onclose = (event) => {
        console.log(
          `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
        );
      };
    };
    wssCallbacks();
    wss.current.onmessage = (e) => {
      const response = JSON.parse(e.data);

      if (response.success) {
        const updatedUser = new User(response.newUser.id);
        updatedUser.max_stamina = user.max_stamina;
        updatedUser.setUser(response.newUser);

        setUser(updatedUser);
      } else {
        console.log("Money has not increased");
      }
    };
  }

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
        <Button
          label={`Buy it now, ${tg?.initDataUnsafe?.user?.first_name}`}
          className='btn-primary-50 '
          onClick={() => console.log("test")}
        />

        {user && wss.current && <UserBalance wss={wss.current} user={user} />}

        <Button
          label={getSubsMsg()}
          className='btn-primary-50 icon'
          onClick={async () => {
            if (!user) return;
            // первый аргумент id канала
            const subscribed = (await user.checkSubscription(
              "@OutTestChanel"
            )) as boolean | null;
            setUserSubscribed(subscribed);
          }}
        />
        <Button
          label={`I know your id. ${tg?.initDataUnsafe?.user?.id}`}
          className='btn-primary-50 '
          icon='shopping_cart'
          onClick={() => console.log("test")}
        />
        <Filters />
      </main>
      <Nav />
    </>
  );
}
