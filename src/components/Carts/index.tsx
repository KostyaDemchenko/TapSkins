import React, { useState } from "react";
import Image from "next/image";

import Modal from "@/src/components/Modal";
import Rare from "@/src/components/Rare";
import Float from "@/src/components/Float";
import Button from "@/src/components/Button";
import SkinBackground from "@/src/components/SkinBackground";
import iconObj from "@/public/icons/utils";

import { truncateName, truncateFloat } from "@/src/utils/functions";
import { Cart, Skin } from "@/src/utils/types";

import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

// SkinCard
interface SkinCardProps {
  skin: Skin;
  className?: string;
  addToCartHandle: (skin: Skin) => void;
}

const SkinCard: React.FC<SkinCardProps> = ({
  skin,
  className = "",
  addToCartHandle,
}) => {
  const [modalId] = useState(`cartTrigger-${skin.item_id}`);

  return (
    <>
      <div className={`skin-card ${className}`}>
        <SkinBackground
          imageSrc={skin.image_src}
          rarity={skin.rarity}
          size='small'
          id={modalId}
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
                <p className='price-value'>
                  {skin.price.toLocaleString("RU-ru")}
                </p>
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
              onClick={() => addToCartHandle(skin)}
            />
          </div>
        </div>
      </div>

      <Modal
        modalTitle=''
        height='77dvh'
        triggerId={modalId}
        closeElement={
          <Button
            label={`Buy Now`}
            className='btn-primary-50'
            icon=''
            onClick={() => {}}
          />
        }
      >
        <div className='skin-full-details'>
          <SkinBackground
            imageSrc={skin.image_src}
            rarity={skin.rarity}
            size='large'
          />
          <div className='skin-name-box'>
            <h3 className='skin-name'>
              {truncateName(skin.skin_name, 35)}{" "}
              {skin.startrack && (
                <span className='startrack'>{skin.startrack}</span>
              )}
            </h3>
            <div className='available-box'>
              <p className='available'>Available:</p>
              <p className='available-user-value'>Sample</p>
              <Image
                src={iconObj.purpleCoin}
                width={12}
                height={12}
                alt='Purple coin'
              />
            </div>
          </div>
          <Float floatValue={skin.float} />
          <Rare rarity={skin.rarity} />
          <div className='price-box'>
            <p className='price-label'>Price</p>
            <div className='price'>
              <p className='price-value'>
                {skin.price.toLocaleString("RU-ru")}
              </p>
              <Image
                src={iconObj.purpleCoin}
                width={12}
                height={12}
                alt='Purple coin'
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

// SkinOrderCard
interface SkinOrderCardProps {
  skin: Skin;
  deleteHandle: () => void;
  showDeleteIcon?: boolean;
}

const SkinOrderCard: React.FC<SkinOrderCardProps> = ({
  skin,
  deleteHandle,
  showDeleteIcon = true, // Значение по умолчанию
}) => {
  return (
    <div className='skin-card skin-order-card'>
      {showDeleteIcon && (
        <div
          className='skin-order-card-trash material-symbols-outlined'
          onClick={deleteHandle}
        >
          delete
        </div>
      )}
      <div className='img-case'>
        <SkinBackground
          imageSrc={skin.image_src}
          rarity={skin.rarity}
          size='medium'
        />
      </div>
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
              <p className='price-value'>
                {skin.price.toLocaleString("RU-ru")}
              </p>
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
      </div>
    </div>
  );
};

// HistoryOrderCard
interface HistoryOrderCardProps {
  skin: Skin;
  status: "In Progress" | "Done" | "Canceled";
  id?: string;
}

const HistoryOrderCard: React.FC<HistoryOrderCardProps> = ({
  skin,
  status,
  id,
}) => {
  let statusColor;

  switch (status) {
    case "In Progress":
      statusColor = "var(--color-system-yellow)";
      break;
    case "Done":
      statusColor = "var(--color-system-green)";
      break;
    case "Canceled":
      statusColor = "var(--color-system-red)";
      break;
    default:
      statusColor = "black";
      break;
  }

  return (
    <>
      <div className='skin-card history-order-card' id={id}>
        <span className='material-symbols-outlined get-info'>info</span>
        <div className='img-case'>
          <SkinBackground
            imageSrc={skin.image_src}
            rarity={skin.rarity}
            size='medium'
          />
        </div>
        <div className='skin-info'>
          <div className='top-box'>
            <div className='status' style={{ color: statusColor }}>
              {status}
            </div>
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
                <p className='price-value'>
                  {skin.price.toLocaleString("RU-ru")}
                </p>
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
        </div>
      </div>
    </>
  );
};

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
  id?: string;
  onClick: () => void; // Добавляем пропс для обработки клика
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  className,
  onClick,
  id,
}) => (
  <a
    id={id}
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
        <p className='reward-count'>+ {task.reward.toLocaleString("RU-ru")}</p>
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
  </a>
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
  onClickHandle?: () => void;
}

const ReferalCard: React.FC<ReferalCardProps> = ({
  reward,
  className,
  onClickHandle,
}) => (
  <a
    target='_blank'
    className={`referal-card ${className}`}
    key={reward.reward_id}
    onClick={onClickHandle}
  >
    <div className='referal-icon'>
      <Image
        src={reward.referal_icon}
        width={60}
        height={60}
        alt='referal icon'
      />
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
  </a>
);

// OrderCartTrigger
interface OrderCartTriggerProps {
  order_id?: number;
  order_content?: string;
  onClickHandle?: () => void;
  id?: string;
}

const OrderCartTrigger: React.FC<OrderCartTriggerProps> = ({
  order_id,
  order_content,
  onClickHandle,
  id,
}) => (
  <div className='order-cart' onClick={onClickHandle} id={id}>
    <div className='left-side'>
      <div className='icon-box'>
        <span className='material-symbols-rounded'>shopping_cart</span>
      </div>
      <div className='order-details'>
        <p className='order-id'>Order: #{order_id}</p>
        <p className='order-content'>{order_content}</p>
      </div>
    </div>
    <div className='right-side'>
      <span className='material-symbols-outlined'>arrow_forward_ios</span>
    </div>
  </div>
);

export {
  SkinCard,
  TaskCard,
  ReferalCard,
  SkinOrderCard,
  HistoryOrderCard,
  OrderCartTrigger,
};
