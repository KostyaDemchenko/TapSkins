import React from "react";
import Script from "next/script";

import Button from "@/src/components/Button";
import Filters from "@/src/components/Filters";
import Modal from "@/src/components/Modal";

import "@/src/app/globals.scss";

export default function Home() {
  const [tg, setTg] = React.useState<WebApp | null>();

  React.useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");
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
        <Button
          label={`Buy it now, ${tg?.initDataUnsafe?.user?.first_name}`}
          className='btn-primary-50 icon'
          onClick={() => console.log("test")}
        />
        <Button
          label={`I know your id. ${tg?.initDataUnsafe?.user?.id}`}
          className='btn-primary-50 icon'
          icon='shopping_cart'
          onClick={() => console.log("test")}
        />

        <Button
          label={`Your platform: ${tg?.platform}`}
          className='btn-primary-50 icon'
          icon='shopping_cart'
          onClick={() => console.log("test")}
        />

        <Filters />
      </main>
    </>
  );
}
