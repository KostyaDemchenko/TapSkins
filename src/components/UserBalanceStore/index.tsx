import React from "react";
import Image from "next/image";

import Button from "@/src/components/Button";
import iconObj from "@/public/icons/utils";

import "./style.scss";

interface UserBalanceStoreProps {
  userBalanceStore: number;
}

const UserBalanceStore: React.FC<UserBalanceStoreProps> = ({
  userBalanceStore,
}) => {
  return (
    <div className='user-balance'>
      <div className='balance-box'>
        <p className='title'>Balance</p>
        <div className='amount'>
          <p className='balance'>{userBalanceStore}</p>
          <Image src={iconObj.purpleCoin} alt='Purple Coin' />
        </div>
      </div>
      <Button label='Convert' className='btn-secondary-25' />
      {/* ^^^^for modal trigger^^^^ */}
    </div>
  );
};

export default UserBalanceStore;
