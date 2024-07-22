import React from "react";
import Image from "next/image";
import Button from "@/src/components/Button";
import SkinBackground from "@/src/components/SkinBackground";
import iconObj from "@/public/icons/utils";
import { truncateName, truncateFloat } from "@/src/utils/functions";
import "./style.scss";

// SkinCard
interface SkinCardProps {
  skin: {
    item_id: number;
    skin_name: string;
    weapon_name: string;
    image_src: string;
    price: number;
    float: number;
    rarity: string;
    weapon_type: string;
    startrack: string;
  };
  className?: string;
}

const SkinCard: React.FC<SkinCardProps> = ({ skin, className }) => (
  <div className={`skin-card ${className}`}>
    <SkinBackground
      imageSrc={skin.image_src}
      rarity={skin.rarity}
      size='small'
    />
    <div className='skin-info'>
      <div className='top-box'>
        <div className='skin-name-box '>
          <h3 className='skin-name'>
            {truncateName(skin.skin_name, 35)}{" "}
            {skin.startrack && (
              <span className='startrack'>{skin.startrack}</span>
            )}
          </h3>
        </div>
        <div className='price-float-box'>
          <div className='price'>
            <p className='price-value'>{skin.price}</p>
            <Image
              src={iconObj.purpleCoin}
              width={12}
              height={12}
              alt='Purple coin'
            />
          </div>
          <p className='float'>Float {truncateFloat(skin.float, 6)}</p>
        </div>
      </div>

      <div className='bottom-box'>
        <Button
          label={`Buy`}
          className='btn-primary-25'
          icon=''
          onClick={() => {}}
        />
        <Button
          label={`Add to cart`}
          className='btn-tertiary-white-25'
          icon=''
          onClick={() => {}}
        />
      </div>
    </div>
  </div>
);

// TaskCard
interface TaskCardProps {
  task: {
    task_id: number;
    task_name: string;
    platform_type: string;
    reward_type: string;
    reward: number;
    link_to_join: string;
    social_icon: string;
  };
  className?: string;
  onClick: () => void; // Добавляем пропс для обработки клика
}

const TaskCard: React.FC<TaskCardProps> = ({ task, className, onClick }) => (
  <div
    onClick={onClick}
    className={`task-card ${className}`}
    style={{ cursor: "pointer" }} // Добавляем указатель, чтобы обозначить кликабельность
  >
    <div className='task-icon'>
      <img src={task.social_icon} alt={task.platform_type} />
    </div>
    <div className='task-details'>
      <h3 className='task-name'>{task.task_name}</h3>
      <div className='reward-count-box'>
        <p className='reward-count'>+ {task.reward}</p>
        <div className='reward-type'>
          {task.reward_type === "yellow_coin" ? (
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
);

// ReferalCard
interface ReferalCardProps {
  reward: {
    reward_id: number;
    reward_name: string;
    reward_type: string;
    reward: number;
    referal_icon: string;
  };
  className?: string;
}

const ReferalCard: React.FC<ReferalCardProps> = ({ reward, className }) => (
  <div className={`referal-card ${className}`} key={reward.reward_id}>
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
);

export { SkinCard, TaskCard, ReferalCard };
