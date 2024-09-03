import React, { useEffect, useState } from "react";
import Script from "next/script";
import Head from "next/head";

import Nav from "@/src/components/Nav";
import { User, OrderHistiryData } from "@/src/utils/types";
import ContactUsModal from "@/src/components/ContactUsModal";
import HistoryorderList from "@/src/components/HistoryOrderList";
import Skeleton from "@mui/material/Skeleton";
import NotAMobile from "@/src/components/NotAMobile"; // Импортируем компонент NotAMobile

import "@/src/app/globals.scss";
import "./style.scss";

export default function OrderHistoryPage() {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistiryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

      if (response) {
        setUser(userClass);

        try {
          const orderHistoryResponse = await fetch(
            `/api/order_history?user_id=${userClass.user_id}` // Передаем user_id как параметр
          );
          const data = await orderHistoryResponse.json();
          if (Array.isArray(data.ordersHistoryDataStructured)) {
            setOrderHistory(data.ordersHistoryDataStructured);
          } else {
            console.error(
              "Received data is not an array:",
              data.ordersHistoryDataStructured
            );
          }
        } catch (error) {
          console.error("Error fetching order history:", error);
        } finally {
          setLoading(false);
        }
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
      <main>
        {isMobile ? (
          <>
            <a className='title' href='/cart_page'>
              <span className='material-symbols-outlined'>
                chevron_backward
              </span>
              <h1 className='page-title'>History</h1>
            </a>
            {loading ? (
              <div className='history-order-list'>
                <div className='container'>
                  {Array.from(new Array(5)).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant='rectangular'
                      height={84}
                      animation='wave'
                      sx={{
                        bgcolor: "var(--color-surface)",
                        marginBottom: "5px",
                        width: "100%",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : orderHistory.length > 0 ? (
              user && <HistoryorderList info={orderHistory} />
            ) : (
              <div className='empty-cart'>
                <p>No items in the history!</p>
                <a className='btn-secondary-35' href='/skin_store_page'>
                  <span className='material-symbols-outlined'>
                    shopping_cart
                  </span>{" "}
                  To store
                </a>
              </div>
            )}
          </>
        ) : (
          <NotAMobile />
        )}
      </main>
      <ContactUsModal triggerId='contactUsModal' />
      <Nav />
    </>
  );
}
