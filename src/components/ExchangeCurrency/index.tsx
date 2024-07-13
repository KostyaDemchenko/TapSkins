import React, { useState } from "react";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";

const ExchangeCurrency: React.FC = () => {
  return (
    <>
      <Modal
        modalTitle="Convert"
        btnTriggerIcon="swap_vert"
        btnTriggerLabel=""
        btnTriggerClassName="user-balance-exchange"
      >
        <div className="content">
          
        </div>

        <Button
          label="Apply"
          className="btn-primary-50 icon"
          onClick={() => console.log("test")} // there should be logic for currency transfer
        />
      </Modal>
    </>
  );
};

export default ExchangeCurrency;
