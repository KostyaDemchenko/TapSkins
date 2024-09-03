import React, { useEffect, useState } from "react";
import Script from "next/script";
import Head from "next/head";

import Nav from "@/src/components/Nav";
import RewardCenter from "@/src/components/RewardCenter";
import NotAMobile from "@/src/components/NotAMobile"; // Импортируем компонент NotAMobile
import { User } from "@/src/utils/types";

import "@/src/app/globals.scss";
import "./style.scss";

export default function RewardsPage() {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(true); // Новое состояние для проверки устройства

  // Проверка платформы устройства
  useEffect(() => {
    if (!tg) return;

    // Проверяем платформу Telegram Web App
    const platform = tg.platform;
    if (platform !== "android" && platform !== "ios") {
      setIsMobile(false); // Если не Android и не iOS, показываем компонент NotAMobile
    } else {
      setIsMobile(true);
    }
  }, [tg]);

  useEffect(() => {
    if (!isMobile || !tg) return; // Проверка на мобильное устройство

    tg.expand();
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id, tg.initData);
      const response = await userClass.authUser(tg);

      // пока не будет это выполнено, никаких дальнейших действий
      if (response) {
        setUser(userClass);
      }
    })();
  }, [tg, isMobile]);

  return (
    <>
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        ></meta>
        <meta name='screen-orientation' content='portrait' />
        <meta name='x5-orientation' content='portrait' />
        <meta name='x5-fullscreen' content='true' />
        <meta name='full-screen' content='yes' />
      </Head>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      {isMobile ? ( // Условный рендеринг для мобильных устройств
        <>
          <main>
            <h1 className='page-title'>Reward Center</h1>
            {user && <RewardCenter user={user} />}
          </main>
          <Nav /> {/* Навигация отображается только для мобильных устройств */}
        </>
      ) : (
        <NotAMobile />
      )}
    </>
  );
}
