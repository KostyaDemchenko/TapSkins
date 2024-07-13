import React, { useEffect, useState } from "react";
import Image from "next/image";

import iconObj from "@/public/icons/utils";

import "./style.scss";

interface ReferalProps {}

const ReferalList: React.FC<ReferalProps> = () => {
  return (
    <div className='referal-list'>
      <div className='referal-card'>
        <div className='referal-icon'>
          <img src='/img/referal/referal_3.png' alt='referal icon' />
        </div>
        <div className='referal-details'>
          <h3 className='referal-name'>Invite 5 users</h3>
          <div className='reward-count-box'>
            <p className='reward-count'>+ 3000</p>
            <div className='reward-type'>
              {/* {task.reward_type === "yellow_coin" ? ( */}
              <Image
                src={iconObj.yellowCoin}
                width={12}
                height={12}
                alt='Yellow coin'
              />
              {/* // ) : (
                //   <Image
                //     src={iconObj.purpleCoin}
                //     width={12}
                //     height={12}
                //     alt='Purple coin'
                //   />
                // )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferalList;
