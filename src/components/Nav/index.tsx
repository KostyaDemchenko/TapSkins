import React, { useEffect, useState } from "react";
import Image from "next/image";
import MyTooltip from "@/src/components/Tooltip";
import { useRouter } from "next/router";

import iconObj from "@/public/icons/utils";

import "./style.scss";

interface NavProps {}

const Nav: React.FC<NavProps> = () => {
  const router = useRouter();
  const [activePage, setActivePage] = useState("");

  useEffect(() => {
    setActivePage(router.pathname);
  }, [router.pathname]);

  return (
    <>
      <nav>
        <a href='/' className='link'>
          <Image
            src={activePage === "/" ? iconObj.mainPageActive : iconObj.mainPage}
            width={32}
            height={32}
            alt='Main page'
          />
        </a>
        <a href='/skin_store_page' className='link'>
          <Image
            src={
              activePage === "/skin_store_page"
                ? iconObj.storePageActive
                : iconObj.storePage
            }
            width={32}
            height={32}
            alt='Store page'
          />
        </a>
        <a href='/cart_page' className='link'>
          <Image
            src={
              activePage === "/cart_page"
                ? iconObj.cartPageActive
                : iconObj.cartPage
            }
            width={32}
            height={32}
            alt='Cart page'
          />
        </a>
        <a href='/rewards_page' className='link'>
          <Image
            src={
              activePage === "/rewards_page"
                ? iconObj.referalPageActive
                : iconObj.referalPage
            }
            width={32}
            height={32}
            alt='Rewards page'
          />
        </a>
        <a href='#' className='link disabled' data-tooltip-id='disabled'>
          <Image
            src={iconObj.pokerChip}
            width={32}
            height={32}
            alt='Poker chip'
          />
        </a>
      </nav>
      <MyTooltip tooltipId='disabled' tooltipContent='Coming soon' />
    </>
  );
};

export default Nav;
