import React from "react";
import "@/app/globals.scss";

import Button from "@/components/button";
import Components from "@/components/components_test";

export default function Home() {
  return (
    <main>
      <Button
        label='Buy Now'
        className='btn-primary-50'
        onClick={() => console.log("test")}
      />
      <Button
        label='Buy Now'
        className='btn-primary-50'
        icon='shopping_cart'
        onClick={() => console.log("test")}
      />

      <Components />
    </main>
  );
}
