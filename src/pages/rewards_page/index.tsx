import React from "react";
import Script from "next/script";

import Button from "@/src/components/Button";
import Filters from "@/src/components/Filters";
import Nav from "@/src/components/Nav";
import { User, UserObj } from "@/src/utils/types";

import "@/src/app/globals.scss";
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

  return (
    <>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      <main>
        <h1>Rewards Page</h1>
        <span
          style={{
            color: "white",
          }}
        >
          {user && user.balance_common && <>{user.balance_common}</>}
          {!user && "Error occured :("}
        </span>
        <Filters />
      </main>
      <Nav />
    </>
  );
}
