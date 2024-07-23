import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";

import { User } from "@/src/utils/types";

import Nav from "@/src/components/Nav";
import Image from "next/image";
import Button from "@/src/components/Button";

import "@/src/app/globals.scss";
import "./style.scss";
import { Skin, Cart } from "@/src/utils/types";
import { SkinOrderCard } from "@/src/components/Carts";
import iconObj from "@/public/icons/utils";


export default function CartPage() {
  const [cartItems, setCartItems] = useState<Skin[]>([]);
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const userCart = useRef<null | Cart>(null);

  const deleteHandle = (el: Skin) => {
    const result = userCart.current!.deleteFromCart(el);

    if (!result.success) return;

    setCartItems(userCart.current!.getItems());
  }

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
      const userClass = new User(tg.initDataUnsafe.user.id);
      const response = await userClass.authUser(tg);

      if (response) {
        const userBalance = 1000;
        setCartItems((new Cart(userBalance)).getItems());
        setUser(userClass);
      }
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
        <div className='container'>
          <div className='top-box'>
            <h3 className="items-amnt">Items ({cartItems.length})</h3>
            <a href="#">History</a>
          </div>
          {userCart.current &&
            <>
              {!cartItems.length && <>Cart is empty</>}
              {!!cartItems.length && <>
                {cartItems.map((el) => {
                  return <SkinOrderCard key={el.item_id} deleteHandle={() => {
                    deleteHandle(el);
                  }} skin={el} />;
                })}
                <div className="total-price-box">
                  <p>Total</p>
                  <h4>{userCart.current.getTotalPrice().toLocaleString("RU-ru")} <Image
                    src={iconObj.purpleCoin}
                    width={12}
                    height={12}
                    alt='Purple coin'
                  /></h4>
                </div>
                <Button
                  label={`Buy`}
                  className='btn-primary-25 purchase-buying'
                  icon=''
                  onClick={() => { }}
                />
              </>}
            </>
          }
        </div>
      </main>
      <Nav />
    </>
  );
}
