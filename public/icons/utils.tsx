import purpleCoin from "./purple_coin.svg";
import yellowCoin from "./yellow_coin.svg";

//page icons inactive
import mainPage from "./page_icons/main_page.svg";
import storePage from "./page_icons/store_page.svg";
import cartPage from "./page_icons/cart_page.svg";
import referalPage from "./page_icons/referal_page.svg";
import pokerChip from "./page_icons/poker_chip.svg";

//page icons active
import mainPageActive from "./page_icons_active/main_page.svg";
import storePageActive from "./page_icons_active/store_page.svg";
import cartPageActive from "./page_icons_active/cart_page.svg";
import referalPageActive from "./page_icons_active/referal_page.svg";

import filters from "./filters.svg";

const obj: { [key: string]: string } = {
  purpleCoin: purpleCoin,
  yellowCoin: yellowCoin,
  filters: filters,

  //page icons inactive
  mainPage: mainPage,
  storePage: storePage,
  cartPage: cartPage,
  referalPage: referalPage,
  pokerChip: pokerChip,

  //page icons active
  mainPageActive: mainPageActive,
  storePageActive: storePageActive,
  cartPageActive: cartPageActive,
  referalPageActive: referalPageActive,
};

export default obj;
