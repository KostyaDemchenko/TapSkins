import React from "react";
import Image from "next/image";

import imgObj from "@/public/img/utils";

import "./style.scss";

interface NotAMobileProps {}

const NotAMobile: React.FC<NotAMobileProps> = () => {
  return (
    <div className='container not-a-mobile'>
      <p>Play on your mobile!</p>
      <Image src={imgObj.qr} width={250} height={250} alt='qr code' priority />
      <p>Scan me!</p>
    </div>
  );
};

export default NotAMobile;
