import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Image from "next/image";
import Head from "next/head";

import { SuccessDisplay, User } from "@/src/utils/types";

import Nav from "@/src/components/Nav";
import Button from "@/src/components/Button";
import ValidationModal from "@/src/components/ValidationModal";

import { Id, ToastContainer, ToastOptions, toast } from "react-toastify";
import iconObj from "@/public/icons/utils";

import { Skin, Cart } from "@/src/utils/types";
import { SkinOrderCard, HistoryOrderCard } from "@/src/components/Carts";

import "@/src/app/globals.scss";
import "./style.scss";
import { boolean } from "zod";

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
  const [cartItems, setCartItems] = useState<Skin[]>([]);
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [opportunityToBuy, setOpportunityToBuy] = useState<SuccessDisplay>({
    success: false,
    message: "",
  });

  const userCart = useRef<null | Cart>(null);
  const toastId = useRef<Id | null>(null);

  const deleteHandle = async (el: Skin) => {
    if (!user) return;
    setIsDeleting(true);
    toastId.current = toast.loading("Trying to delete...", toastSettings);
    const status = await userCart.current!.deleteFromCart(el, user.getInitData());

    toast.update(toastId.current, {
      render: status.message,
      type: status.success ? "success" : "error",
      isLoading: false,
      autoClose: 3000
    });

    setIsDeleting(false);
  };

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
        setCartItems(await userCart.current.getItems(tg.initData));
        setUser(userClass);
      }
    })();
  }, [tg]);

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
            <h3 className='items-amnt'>Items ({cartItems.length})</h3>
            <a className='btn-secondary-35' href='/order_history'>
              History
            </a>
          </div>
          {userCart.current && cartItems && (
            <>
              {!cartItems.length && (
                <div className='empty-cart'>
                  <p>No items in the cart!</p>
                  <a className='btn-secondary-35' href='/skin_store_page'>
                    <span className='material-symbols-outlined'>
                      shopping_cart
                    </span>{" "}
                    To store
                  </a>
                </div>
              )}
              {!!cartItems.length && user && (
                <>
                  {cartItems.map((el) => {
                    return (
                      <SkinOrderCard
                        key={el.item_id}
                        deleteHandle={() => {
                          deleteHandle(el);
                        }}
                        skin={el}
                      />
                    );
                  })}
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
                      if (isDeleting) return true
                      if (!user) return false;
                      return (
                        user.getBalancePurple() <
                        userCart.current.getTotalPrice()
                      );
                    })()}
                    id='tradeLinkValidation'
                    onClick={function (e) { }}
                  />
                </>
              )}

              <ValidationModal
                onClickHandle={async (e) => {
                  if (
                    !user ||
                    !userCart.current ||
                    opportunityToBuy.loading ||
                    opportunityToBuy.success
                  )
                    return;
                  setOpportunityToBuy({
                    loading: true,
                    message: "Checking skins for availability...",
                    success: false,
                  });
                  const data = {
                    success: true,
                    message: "Ok!"
                  }
                  // const data = await user!.buySkins(
                  //   await userCart.current.getItems(user.getInitData())
                  // );
                  if (data.success) {
                    userCart.current.clearCart();
                    setCartItems([]);
                  }
                  setOpportunityToBuy(data);
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
