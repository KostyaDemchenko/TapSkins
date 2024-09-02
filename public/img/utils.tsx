import { StaticImageData } from "next/image";
import contactUs from "./contact_us.png";
import bomb from "./bomb.png";
import main_preloader from "./main_preloader.png";
import dailyRewardIcon from "./daily_reward_icon.png";
import qr from "./qr.png";

const obj: { [key: string]: StaticImageData } = {
  contactUs: contactUs,
  bomb: bomb,
  qr: qr,
  main_preloader: main_preloader,
  dailyReward: dailyRewardIcon,
};

export default obj;
