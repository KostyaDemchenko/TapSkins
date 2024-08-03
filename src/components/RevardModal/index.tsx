import React from "react";
import Image from "next/image";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";

import iconObj from "@/public/icons/utils";

import "./style.scss";

interface RewardModalProps {
  triggerId?: string;
  isVisible: boolean;
  onClose: () => void;
  rewardAmount: number;
  rewardName: string;
  rewardType: "purple_coin" | "yellow_coin";
}

const RewardModal: React.FC<RewardModalProps> = ({
  triggerId,
  isVisible,
  onClose,
  rewardAmount,
  rewardName,
  rewardType,
}) => {
  return (
    <Modal
      modalTitle='Reward'
      height='80dvh'
      className='reward-modal'
      closeElement={
        <Button
          label={`Got It`}
          className='btn-primary-50'
          icon=''
          onClick={onClose}
        />
      }
      triggerId={triggerId}
      isVisible={isVisible}
      onClose={onClose}
    >
      <div className='reward-box'>
        <p className='reward-amount'>+ {rewardAmount}</p>
        {rewardType === "purple_coin" && (
          <Image
            src={iconObj.purpleCoin}
            width={16}
            height={16}
            alt='Purple coin'
          />
        )}
        {rewardType === "yellow_coin" && (
          <Image
            src={iconObj.yellowCoin}
            width={16}
            height={16}
            alt='Yellow coin'
          />
        )}
      </div>
      <div className='description-box'>
        <p className='title'>Your bonus for: {rewardName}</p>
        <p className='description'>Take your reward now!</p>
      </div>
    </Modal>
  );
};

export default RewardModal;
