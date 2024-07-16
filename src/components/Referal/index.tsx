// Default import
import React, { useEffect, useState } from "react";
import { ReferalCard } from "@/src/components/Carts";

// Style import
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
        <ReferalCard key={reward.reward_id} reward={reward} />
      ))}
    </div>
  );
};

export default ReferalList;
