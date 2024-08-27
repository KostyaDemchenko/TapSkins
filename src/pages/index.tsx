import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Head from "next/head";

import Nav from "@/src/components/Nav";
import UserBalance from "@/src/components/UserBalance";
import Preloader from "@/src/components/MainPreloader";

import { registerUserResponse, User } from "../utils/types";

import "@/src/app/globals.scss";

const webSocketAddress = process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!;

export default function Home() {
  const [tg, setTg] = React.useState<WebApp | null>();
  // нужно добавить еще одно состояние, undefined, которое бы значило что авторизация провалилась
  // null - еще пользователя нету, то есть был послан запрос с авторизацией
  const [user, setUser] = React.useState<User | null>(null);
  // boolean - подписан\неподписан
  // undefined - еще ничего не отправлено
  // null - ошибка какая-то
  const [wss, setWss] = React.useState<null | WebSocket>(null);
  // const wss = React.useRef<null | WebSocket>(null);

  // Состояние для отображения прелоадера
  const [showPreloader, setShowPreloader] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false); // Новое состояние для завершения авторизации

  const preloaderDuration = 3000; // Переменная для задания времени отображения прелоадера

  useEffect(() => {
    // Проверяем, отображался ли прелоадер ранее
    const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

    if (!hasSeenPreloader) {
      setShowPreloader(true);
      sessionStorage.setItem("hasSeenPreloader", "true");
    } else {
      setShowPreloader(false);
    }
  }, []);

  useEffect(() => {
    // Прелоадер скрывается после указанного времени, но только если авторизация завершена
    const preloaderTimeout = setTimeout(() => {
      if (authCompleted) {
        setShowPreloader(false);
      }
    }, preloaderDuration);

    return () => clearTimeout(preloaderTimeout);
  }, [authCompleted, preloaderDuration]);

  useEffect(() => {
    if (!tg) return;

    tg.expand()
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const userClass = new User(tg.initDataUnsafe.user.id, tg.initData);
      const customParam = urlParams.get("referal");
      const response = (await userClass.authUser(
        tg,
        customParam,
        true
      )) as registerUserResponse;

      // пока не будет это выполнено, никаких нахуй дальше действий
      if (response.success) {
        userClass.receivedBonus = response.bonus ? response.bonus : null;
        // отобразить модалку о получении награды, если там награда какая-то была
        // userClass.getRewardsForCompletedTasks();
        setUser(userClass);
        try {
          console.log("Connecting...");
          const ws = new WebSocket(`${webSocketAddress}?${userClass.getInitData()}`);
          setWss(ws);
          ws.onclose = (event) => {
            console.log(
              `WebSocket closed with code: ${event.code}, reason: ${event.reason}`
            );
            global.window.location.reload();
          };
          ws.onopen = () => {
            console.log("Connected");
          };
        } catch (e) {
          console.error(e);
        }
      }

      // Устанавливаем состояние завершения авторизации
      setAuthCompleted(true);
    })();
  }, [tg]);

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
      </Head>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />

      {showPreloader ? (
        <Preloader duration={preloaderDuration} /> // Передаем переменную времени отображения прелоадера
      ) : (
        <main
          style={{
            display: "flex",
            gap: "15px",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* {!user && <UserBalance />} */}
          {user && wss && <UserBalance user={user} wss={wss} />}
        </main>
      )}

      <Nav />
    </>
  );
}
