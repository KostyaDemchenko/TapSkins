import React, { useState, useEffect } from "react";
import Image from "next/image";

import RewardModal from "@/src/components/RevardModal";

import { User } from "@/src/utils/types";
import iconObj from "@/public/icons/utils";
import imgObj from "@/public/img/utils";
import { formatDate } from "@/src/utils/functions";

import "./style.scss";

interface DailyRewardProps {
  className?: string;
  onClick?: () => void;
  lastTimeClicked: string; // Дата последнего клика в формате строки
  user: User;
}

const DailyReward: React.FC<DailyRewardProps> = ({
  className,
  lastTimeClicked,
  onClick,
  user,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canClaimReward, setCanClaimReward] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  function getCurrentDateInUTC() {
    const now = new Date();
    const utcDate = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
      )
    );

    return utcDate;
  }

  useEffect(() => {
    const fetchCurrentTime = async () => {
      setCurrentTime(getCurrentDateInUTC());
    };

    fetchCurrentTime();
    const interval = setInterval(fetchCurrentTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentTime) {
      const parseDate = (dateString: string) => {
        const [day, month, year, hour, minute, second] = dateString
          .replace(/[-:]/g, " ")
          .split(" ")
          .map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      };

      const checkRewardStatus = () => {
        const now = currentTime.getTime();
        const lastClickTime = parseDate(lastTimeClicked).getTime();
        const timeDifference = now - lastClickTime;

        if (timeDifference >= 24 * 60 * 60 * 1000) {
          setCanClaimReward(true);
          setTimeRemaining("");
        } else {
          setCanClaimReward(false);
          const hours = Math.floor(
            (24 * 60 * 60 * 1000 - timeDifference) / (60 * 60 * 1000)
          );
          const minutes = Math.floor(
            (24 * 60 * 60 * 1000 - timeDifference - hours * 60 * 60 * 1000) /
              (60 * 1000)
          );
          const seconds = Math.floor(
            (24 * 60 * 60 * 1000 -
              timeDifference -
              hours * 60 * 60 * 1000 -
              minutes * 60 * 1000) /
              1000
          );
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      };

      checkRewardStatus();
      const interval = setInterval(checkRewardStatus, 1000);

      return () => clearInterval(interval);
    }
  }, [lastTimeClicked, currentTime]);

  const handleClick = async () => {
    if (!canClaimReward) return; // предотвращаем выполнение если награду нельзя получить

    console.log("Trying to get daily reward...");
    const posibilityToClaimReward = await user.getDailyReward();
    if (canClaimReward && onClick && posibilityToClaimReward.success) {
      console.log("Claiming...");
      setCanClaimReward(false);
      lastTimeClicked = formatDate(Date.now());
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        id='rewardModalTrigger'
        className={`task-card daily-reward ${className} ${
          !canClaimReward ? "disabled" : ""
        }`}
        disabled={!canClaimReward}
        style={{ cursor: canClaimReward ? "pointer" : "not-allowed" }}
      >
        <div className='left-site'>
          <div className='task-icon'>
            <Image
              src={imgObj.dailyReward}
              alt='Daily reward'
              width={60}
              height={60}
            />
          </div>
          <div className='task-details'>
            <h3 className='task-name'>Daily Reward</h3>
            <div className='reward-count-box'>
              <p className='reward-count'>+ {(5000).toLocaleString("ru-RU")}</p>
              <div className='reward-type'>
                <Image
                  src={iconObj.yellowCoin}
                  width={12}
                  height={12}
                  alt='Purple coin'
                />
              </div>
            </div>
          </div>
        </div>
        <div className='daily-reward-counter'>
          {timeRemaining && (
            <p className='daily-reward-counter-text'>{timeRemaining}</p>
          )}
        </div>
      </button>
      <RewardModal
        triggerId='rewardModalTrigger'
        // isVisible ничего не делает
        isVisible={false}
        onClose={() => setShowModal(false)}
        rewardAmount={5000}
        rewardName='Daily Reward'
        rewardType='yellow_coin'
      />
    </>
  );
};

export default DailyReward;
