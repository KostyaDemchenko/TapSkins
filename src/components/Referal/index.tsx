import React, { useEffect, useState } from "react";
import { ReferalCard } from "@/src/components/Carts";
import Skeleton from "@mui/material/Skeleton";
import RewardModal from "@/src/components/RevardModal";

import "./style.scss";

import { Reward, SuccessDisplay, User } from "@/src/utils/types";

const ReferalList: React.FC<{
  user: User;
  setSuccessClaimedReferal: (e: SuccessDisplay) => void;
}> = ({ user, setSuccessClaimedReferal }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);

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
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchRewards();
  }, []);

  const handleClaimReward = async (reward: Reward) => {
    console.log("Claiming reward...");
    setSuccessClaimedReferal({
      loading: true,
      message: "Claiming reward...",
      success: false,
    });
    const response = await user.getReward(reward);
    setSuccessClaimedReferal({
      success: response.success,
      message: response.message,
      loading: false,
    });
    console.log(response);
    if (response.success) {
      setCurrentReward(reward);
      setShowModal(true);
    }
  };

  return (
    <div className='referal-list'>
      {loading
        ? Array.from(new Array(5)).map((_, index) => (
            <Skeleton
              key={index}
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
            <ReferalCard
              onClickHandle={() => handleClaimReward(reward)}
              key={reward.reward_id}
              reward={reward}
            />
          ))}
      {currentReward && (
        <RewardModal
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          rewardAmount={currentReward.reward}
          rewardName={currentReward.reward_name}
          rewardType={
            currentReward.reward_type === "purple_coin" ||
            currentReward.reward_type === "yellow_coin"
              ? currentReward.reward_type
              : "purple_coin"
          }
        />
      )}
    </div>
  );
};

export default ReferalList;
