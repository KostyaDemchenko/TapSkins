import { StaticImageData } from "next/image";
import contactUs from "./contact_us.png";
import bomb from "./bomb.png";
import main_preloader from "./main_preloader.png";
import dailyRewardIcon from "./daily_reward_icon.png";

const obj: { [key: string]: StaticImageData } = {
  contactUs: contactUs,
  bomb: bomb,
  main_preloader: main_preloader,
  dailyReward: dailyRewardIcon,
};

export default obj;
