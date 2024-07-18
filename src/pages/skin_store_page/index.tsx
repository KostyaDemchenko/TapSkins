import React, { useState, useEffect } from "react";
import Script from "next/script";

import Nav from "@/src/components/Nav";
import SkinStore from "@/src/components/SkinStoreList";
import Filters from "@/src/components/Filters";
import Search from "@/src/components/Search";
import { User } from "@/src/utils/types";

import "@/src/app/globals.scss";
import "./style.scss";

const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

export default function RewardsPage() {
  const [tg, setTg] = useState<WebApp | null>();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id);
      const response = await userClass.authUser(tg);

      if (response) setUser(userClass);
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
        <div className='container filter-box'>
          <div className='top-box'>
            <div className='user-balance'></div>
            <div className='modal-trigger-convert'></div>
          </div>
          <div className='middle-box'>
            <div className='top-box'>
              <Search onSearch={setSearchTerm} />
              <Filters />
            </div>
            <div className='bottom-box'>
              <div className='selected-categories-box'></div>
              <div className='sort-modal-triger'></div>
            </div>
          </div>
          <SkinStore searchTerm={searchTerm} />
        </div>
      </main>
      <Nav />
    </>
  );
}
