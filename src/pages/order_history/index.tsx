import React from "react";
import Script from "next/script";
import Head from "next/head";

import Nav from "@/src/components/Nav";
import { User, UserObj } from "@/src/utils/types";
import { HistoryOrderCard } from "@/src/components/Carts";
import ContactUsModal from "@/src/components/ContactUsModal";

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
      const userClass = new User(tg.initDataUnsafe.user.id, tg.initData);
      const response = await userClass.authUser(tg);

      if (response) {
        setUser(userClass);
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
        </a>
        {/* запрос на получение истории закказов пользователя если они есть то
        отображать */}
        {/* <HistoryOrderCard id="contactUsModal" skin={сюда передавать даные о скине} status={Тут может быть 3 варината "Done" | "In Progress" | "Canceled" } /> */}
        {/* ^^^^^^^ */}
        {/*  обернуть в список  */}
        {/* //
        //
        // */}
        {/* если в списке ничего нету отображать это контейнер */}
        {/* <div className='no-history'>
          <p className='description'>No History Yet...</p>
          <Link className='btn-secondary-35' href='/skin_store_page'>
            <span className='material-symbols-outlined two'>shopping_cart</span>
            <p>To cart</p>
          </Link>
        </div> */}
      </main>
      <ContactUsModal triggerId='contactUsModal' />
      <Nav />
    </>
  );
}
