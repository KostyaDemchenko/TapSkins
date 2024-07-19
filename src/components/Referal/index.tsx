// Default import
import React, { useEffect, useState } from "react";
import { ReferalCard } from "@/src/components/Carts";
import Skeleton from "@mui/material/Skeleton";

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
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        // Задержка перед отключением загрузки
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchRewards();
  }, []);

  return (
    <div className='referal-list'>
      {loading
        ? Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              variant='rounded'
              height={84}
              animation='wave'
              sx={{
                bgcolor: "var(--color-surface)",
                marginBottom: "5px",
                width: "100%",
              }}
            />
          ))
        : rewards.map((reward) => (
            <ReferalCard key={reward.reward_id} reward={reward} />
          ))}
    </div>
  );
};

export default ReferalList;
