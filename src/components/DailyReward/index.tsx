import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

import RewardModal from "@/src/components/RevardModal";

import iconObj from "@/public/icons/utils";
import imgObj from "@/public/img/utils";

import "./style.scss";

interface DailyRewardProps {
  className?: string;
  onClick?: () => void;
  lastTimeClicked: string; // Дата последнего клика в формате строки
}

const DailyReward: React.FC<DailyRewardProps> = ({
  className,
  lastTimeClicked,
  onClick,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [canClaimReward, setCanClaimReward] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const response = await axios.get(
          "http://worldtimeapi.org/api/timezone/Etc/UTC"
        );
        const currentTime = new Date(response.data.datetime);
        setCurrentTime(currentTime);
      } catch (error) {
        console.error("Error fetching current time:", error);
      }
    };

    fetchCurrentTime();
    const interval = setInterval(fetchCurrentTime, 60000); // Обновляем время каждую минуту

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentTime) {
      const parseDate = (dateString: string) => {
        const [day, month, year, hour, minute, second] = dateString
          .replace(/[-:]/g, " ")
          .split(" ")
          .map(Number);
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
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

  const handleClick = () => {
    if (canClaimReward && onClick) {
      onClick();
      setShowModal(true);
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        id='rewardModalTrigger'
        className={`task-card daily-reward ${className} ${
          !canClaimReward ? "disabled" : ""
        }`}
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
      </div>
      <RewardModal
        triggerId='rewardModalTrigger'
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        rewardAmount={5000}
        rewardName='Daily Reward'
        rewardType='yellow_coin'
      />
    </>
  );
};

export default DailyReward;
