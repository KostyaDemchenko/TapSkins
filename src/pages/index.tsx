import React from "react";
import "@/app/globals.scss";

import Button from "@/components/button";

export default function Home() {
  return (
    <main>
      <Button
        label='Buy Now'
        className='btn-primary-50 icon'
        onClick={() => console.log("test")}
      />
      <Button
        label='Buy Now'
        className='btn-primary-50 icon'
        icon='shopping_cart'
        onClick={() => console.log("test")}
      />
    </main>
  );
}
