import React, { useState } from "react";
import Image from "next/image";
import MyTooltip from "@/src/components/Tooltip";

import iconObj from "@/public/icons/utils";

import "./style.scss";

interface NavProps {}

const Nav: React.FC<NavProps> = () => {
  return (
    <>
      <nav>
        <a href='#' className='link'>
          <Image
            src={iconObj.mainPage}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
        <a href='#' className='link'>
          <Image
            src={iconObj.storePage}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
        <a href='#' className='link'>
          <Image
            src={iconObj.cartPage}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
        <a href='#' className='link'>
          <Image
            src={iconObj.referalPage}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
        <a href='#' className='link disabled' data-tooltip-id='disabled'>
          <Image
            src={iconObj.pokerChip}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
      </nav>
      <MyTooltip tooltipId='disabled' tooltipContent='Coming soon' />
    </>
  );
};

export default Nav;
