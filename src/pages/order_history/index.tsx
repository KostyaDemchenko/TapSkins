import React from "react";
import Script from "next/script";
import Head from "next/head";

import Nav from "@/src/components/Nav";
import { User, OrderHistiryData } from "@/src/utils/types";
import ContactUsModal from "@/src/components/ContactUsModal";
import HistoryorderList from "@/src/components/HistoryOrderList";

import "@/src/app/globals.scss";
import "./style.scss";

export default function rewards_page() {
  const [tg, setTg] = React.useState<WebApp | null>();
  const [user, setUser] = React.useState<User | null>(null);
  const [orderHistory, setOrderHistory] = React.useState<OrderHistiryData[]>(
    []
  ); // начальное значение - пустой массив

  React.useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id, tg.initData);
      const response = await userClass.authUser(tg);

      if (response) {
        setUser(userClass);

        // Выполняем запрос к API после аутентификации
        const orderHistoryResponse = await fetch("/api/order_history");
        const orderHistoryData = await orderHistoryResponse.json();
        setOrderHistory(orderHistoryData); // сохраняем данные в состояние
      }
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
      <main>
        <a className='title' href='/cart_page'>
          <span className='material-symbols-outlined'>chevron_backward</span>
          <h1 className='page-title'>History</h1>
          <HistoryorderList info={orderHistory} />{" "}
          {/* передаем данные как пропс */}
        </a>
      </main>
      <ContactUsModal triggerId='contactUsModal' />
      <Nav />
    </>
  );
}
