import React, { useEffect, useState } from "react";
import Image from "next/image";
import iconObj from "@/public/icons/utils";
import "./style.scss";

interface Reward {
  reward_id: number;
  reward_name: string;
  reward_type: string;
  reward: number;
  referal_icon: string;
}

const ReferalList: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch("/api/referal_reward_store");
        const data = await response.json();
        const sortedData = data.referalRewardStoreStructured.sort(
          (a: Reward, b: Reward) => a.reward - b.reward
        );
        setRewards(sortedData);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className='referal-list'>
      {rewards.map((reward) => (
        <div className='referal-card' key={reward.reward_id}>
          <div className='referal-icon'>
            <img src={reward.referal_icon} alt='referal icon' />
          </div>
          <div className='referal-details'>
            <h3 className='referal-name'>{reward.reward_name}</h3>
            <div className='reward-count-box'>
              <p className='reward-count'>+ {reward.reward}</p>
              <div className='reward-type'>
                {reward.reward_type === "yellow_coin" ? (
                  <Image
                    src={iconObj.yellowCoin}
                    width={12}
                    height={12}
                    alt='Yellow coin'
                  />
                ) : (
                  <Image
                    src={iconObj.purpleCoin}
                    width={12}
                    height={12}
                    alt='Purple coin'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReferalList;
