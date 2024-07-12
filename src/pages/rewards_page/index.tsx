import React from "react";
import Script from "next/script";

import Nav from "@/src/components/Nav";
import RewardCenter from "@/src/components/RewardCenter";
import { User, UserObj } from "@/src/utils/types";

import "@/src/app/globals.scss";
import "./style.scss";
const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

export default function rewards_page() {
  const [tg, setTg] = React.useState<WebApp | null>();
  const [user, setUser] = React.useState<User | null>(null);

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
        console.log("Money increased successfully");

        const updatedUser = new User(response.newUser.id);
        updatedUser.copyUser(response.newUser);
        setUser(updatedUser);
      } else {
        console.log("Money has not increased");
      }
    };
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
        <h1 className='page-title'>Reward Center</h1>

        <RewardCenter />
      </main>
      <Nav />
    </>
  );
}
