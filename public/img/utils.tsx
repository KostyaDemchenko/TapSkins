import { StaticImageData } from "next/image";
import contactUs from "./contact_us.png";
import bomb from "./bomb.png";
import preloader from "./preloader.png";
import dailyRewardIcon from "./daily_reward_icon.png";

const obj: { [key: string]: StaticImageData } = {
  contactUs: contactUs,
  bomb: bomb,
  preloader: preloader,
  dailyReward: dailyRewardIcon,
};

export default obj;
