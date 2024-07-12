import React from "react";
import Script from "next/script";

import Nav from "@/src/components/Nav";
import { User } from "@/src/utils/types";

import "@/src/app/globals.scss";
import "./style.scss";

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
        <h1 style={{
          color: "white"
        }}>Rewards Page</h1>
      </main>
      <Nav />
    </>
  );
}
