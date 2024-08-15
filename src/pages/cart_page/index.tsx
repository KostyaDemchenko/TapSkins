import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Image from "next/image";
import Head from "next/head";

import { SuccessDisplay, User } from "@/src/utils/types";

import Nav from "@/src/components/Nav";
import Button from "@/src/components/Button";
import ValidationModal from "@/src/components/ValidationModal";
import Skeleton from "@mui/material/Skeleton";

import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import iconObj from "@/public/icons/utils";

import { Skin, Cart } from "@/src/utils/types";
import { SkinOrderCard } from "@/src/components/Carts";

import "@/src/app/globals.scss";
import "./style.scss";

const toastSettings: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Skin[] | null>(null);
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [opportunityToBuy, setOpportunityToBuy] = useState<SuccessDisplay>({
    success: false,
    message: "",
  });
  const [tradeLink, setTradeLink] = useState<string>("");
  const [orderId, setOrderId] = useState<number | null>(null); // Добавлено состояние для orderId

  const userCart = useRef<null | Cart>(null);
  const toastId = useRef<Id | null>(null);

  const deleteHandle = async (el: Skin) => {
    if (!user || !userCart.current) return;
    setIsDeleting(true);
    toastId.current = toast.loading("Trying to delete...", toastSettings);
    const status = await userCart.current.deleteFromCart(
      el,
      user.getInitData()
    );

    if (status.success) {
      setCartItems(cartItems!.filter((item) => item.item_id !== el.item_id));
    }

    toast.update(toastId.current, {
      render: status.message,
      type: status.success ? "success" : "error",
      isLoading: false,
      autoClose: 3000,
    });

    setIsDeleting(false);
  };

  const handleOrderSubmission = async () => {
    if (
      !user ||
      !userCart.current ||
      opportunityToBuy.loading ||
      opportunityToBuy.success
    )
      return;

    setOpportunityToBuy({
      loading: true,
      message: "Submitting order...",
      success: false,
    });

    try {
      // Получаем время последнего order_id из localStorage
      const lastOrderId = localStorage.getItem("lastOrderId");
      const lastOrderTimestamp = localStorage.getItem("lastOrderTimestamp");
      const currentTimestamp = Date.now();

      // Если времени нет или оно больше 10 секунд, создаем новый order_id
      let orderId = currentTimestamp;
      if (
        lastOrderId &&
        lastOrderTimestamp &&
        currentTimestamp - parseInt(lastOrderTimestamp) < 10000
      ) {
        orderId = parseInt(lastOrderId);
      } else {
        // Обновляем orderId и timestamp в localStorage
        localStorage.setItem("lastOrderId", orderId.toString());
        localStorage.setItem("lastOrderTimestamp", currentTimestamp.toString());
      }

      const orderData = cartItems!.map((item) => ({
        skin_name: item.skin_name,
        image_src: item.image_src,
        item_id: item.item_id,
        user_id: user.user_id,
        order_id: orderId,
        price: item.price,
        float: item.float,
        rarity: item.rarity,
        status: "In Progress",
        startrack: item.startrack,
        user_trade_link: tradeLink,
      }));

      const promises = orderData.map(async (data) => {
        const response = await fetch("/api/order_history/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "last-order-id": orderId.toString(),
            "last-order-timestamp": currentTimestamp.toString(),
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to submit order");
        }
        return await response.json();
      });

      await Promise.all(promises);

      userCart.current.clearCart();
      setCartItems([]);
      setOpportunityToBuy({
        loading: false,
        message: "Order submitted successfully!",
        success: true,
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      setOpportunityToBuy({
        loading: false,
        message: "Failed to submit order.",
        success: false,
      });
    }
  };

  // авторизация и инициализация корзины
  useEffect(() => {


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
        userCart.current = new Cart();
        const items = await userCart.current.getItems(tg.initData);
        setCartItems(items);
        setUser(userClass);
      }
    })();
  }, [tg]);

  // отслеживание состояния возможности покупки
  useEffect(() => {
    if (opportunityToBuy.message.trim() === "") return;

    if (opportunityToBuy.loading) {
      toastId.current = toast.loading(opportunityToBuy.message, {
        ...toastSettings,
        closeOnClick: false,
      });
      return;
    }

    toast.update(toastId.current!, {
      render: opportunityToBuy.message,
      type: opportunityToBuy.success ? "success" : "error",
      isLoading: false,
      pauseOnHover: !opportunityToBuy.success,
      autoClose: 5000,
      closeOnClick: true,
    });
  }, [opportunityToBuy]);

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
      <div style={{ position: "absolute" }}>
        <ToastContainer />
      </div>
      <main>
        <div className='container'>
          <div className='top-box'>
            <h3 className='items-amnt'>
              Items ({cartItems ? cartItems.length : 0})
            </h3>
            <a className='btn-secondary-35' href='/order_history'>
              History
            </a>
          </div>
          {cartItems === null && userCart.current && (
            <>
              {Array.from(new Array(3)).map((_, index) => (
                <Skeleton
                  key={index}
                  variant='rounded'
                  height={120}
                  animation='wave'
                  sx={{
                    bgcolor: "var(--color-surface)",
                    width: "100%",
                  }}
                />
              ))}
            </>
          )}
          {cartItems === null && (
            <div className='empty-cart'>
              <p>No items in the cart!</p>
              <a className='btn-secondary-35' href='/skin_store_page'>
                <span className='material-symbols-outlined'>shopping_cart</span>{" "}
                To store
              </a>
            </div>
          )}
          {cartItems !== null && cartItems.length > 0 && userCart.current && (
            <>
              {cartItems.map((el) => (
                <SkinOrderCard
                  key={el.item_id}
                  deleteHandle={() => deleteHandle(el)}
                  skin={el}
                />
              ))}
              <div className='total-price-box'>
                <p>Total</p>
                <h4>
                  {userCart.current.getTotalPrice().toLocaleString("RU-ru")}{" "}
                  <Image
                    src={iconObj.purpleCoin}
                    width={12}
                    height={12}
                    alt='Purple coin'
                  />
                </h4>
              </div>
              <Button
                label='Buy'
                className='btn-primary-25 purchase-buying'
                icon=''
                disabled={(() => {
                  if (isDeleting) return true;
                  if (!user) return false;
                  return (
                    user.getBalancePurple() < userCart.current.getTotalPrice()
                  );
                })()}
                id='tradeLinkValidation'
                onClick={() => {
                  // Открываем модальное окно, без отправки заказа
                }}
              />
              <ValidationModal
                onConfirm={() => {
                  handleOrderSubmission();
                }}
                triggerId='tradeLinkValidation'
              />
            </>
          )}
        </div>
      </main>
      <Nav />
    </>
  );
}
