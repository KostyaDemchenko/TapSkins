import React from "react";
import Script from "next/script";

import Button from "@/src/components/Button";
import Filters from "@/src/components/Filters";
import Nav from "@/src/components/Nav";
import { User, UserObj } from "../utils/types";

import "@/src/app/globals.scss";
const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

export default function Home() {
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
        console.log("Money increased successfully");

        const updatedUser = new User(response.newUser.id);
        updatedUser.copyUser(response.newUser);
        setUser(updatedUser);
      }
      else {
        console.log("Money has not increased");
      }
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
          {user && user.balance_common && <>{user.balance_common}</>}
          {!user && "Error occured :("}
        </span>

        <Button label={`Increase user money`} className="btn-primary-50 icon"
          onClick={() => {
            // this will be an imitation of clicking chicken
            // func will return false if there is some error with balance increase
            // and true, if everything is okay
            if (!user) return;
            user.increaseBallance(wss);
          }} />
        <Filters />
      </main>
      <Nav />
    </>
  );
}
