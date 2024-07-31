import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Image from "next/image";

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
  const [opportunityToBuy, setOpportunityToBuy] = useState<SuccessDisplay>({
    success: false,
    message: "",
  });


  const userCart = useRef<null | Cart>(null);
  const toastId = useRef<Id>();

  const deleteHandle = (el: Skin) => {
    const status = userCart.current!.deleteFromCart(el);

    if (status.success) toast.success(status.message, toastSettings);
    else toast.error(status.message, toastSettings);

    setCartItems(userCart.current!.getItems());
  };

  useEffect(() => {
    // это потом удалить
    userCart.current = new Cart();
    setCartItems(userCart.current.getItems());
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
        const userBalance = 1000;
        setCartItems(new Cart(userBalance).getItems());
        setUser(userClass);
      }
    })();
  }, [tg]);

  useEffect(() => {
    if (opportunityToBuy.message.trim() === "") return;

    if (opportunityToBuy.loading) {
      toastId.current = toast.loading(opportunityToBuy.message, { ...toastSettings, closeOnClick: false });
      return;
    }

    toast.update(toastId.current!, {
      render: opportunityToBuy.message,
      type: opportunityToBuy.success ? "success" : "error",
      isLoading: false,
      pauseOnHover: !opportunityToBuy.success,
      autoClose: 5000,
      closeOnClick: true
    });

  }, [opportunityToBuy]);

  return (
    <>
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
          {userCart.current && (
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
              {!!cartItems.length && (
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
                    label="Buy"
                    className='btn-primary-25 purchase-buying'
                    icon=''
                    disabled={(() => {
                      if (!user) return false;
                      return user.getBalancePurple() < userCart.current.getTotalPrice();
                    })()}
                    id='tradeLinkValidation'
                    onClick={function (e) {
                    }}
                  />
                </>
              )}

              <ValidationModal onClickHandle={async (e) => {
                if (!userCart.current || opportunityToBuy.loading || opportunityToBuy.success) return;
                setOpportunityToBuy({
                  loading: true,
                  message: "Checking skins for availability...",
                  success: false
                })
                const data = await user!.buySkins(userCart.current.getItems());
                if (data.success) {
                  userCart.current.clearCart();
                  setCartItems([]);
                }
                setOpportunityToBuy(data);
              }} triggerId='tradeLinkValidation' />
            </>
          )}
        </div>
      </main>
      <Nav />
    </>
  );
}
