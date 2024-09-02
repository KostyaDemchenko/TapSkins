import React from "react";
import Image from "next/image";

import imgObj from "@/public/img/utils";

import "./style.scss";

interface NotAMobileProps {}

const NotAMobile: React.FC<NotAMobileProps> = () => {
  return (
    <div className='container not-a-mobile'>
      <p className='title'>Play on your mobile!</p>
      <a href='https://t.me/TapSkins_bot' className='link' target='_blank'>
        <Image
          src={imgObj.qr}
          width={250}
          height={250}
          alt='qr code'
          priority
        />
      </a>
      <p className='description'>Scan me!</p>
    </div>
  );
};

export default NotAMobile;
