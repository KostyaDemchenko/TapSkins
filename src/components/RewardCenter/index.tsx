import React, { useState } from "react";

import TasksList from "@/src/components/TasksList";
import ReferralsList from "@/src/components/Referal";
import Button from "@/src/components/Button";

import "./style.scss";

const RewardCenter = () => {
  const [activeSection, setActiveSection] = useState("tasks");

  const invitedReferals = 5; // Потом сделать запрос для получения этих данных

  const handleSectionChange = (section: React.SetStateAction<string>) => {
    setActiveSection(section);
  };

  return (
    <>
      <div className='container reward-center'>
        <div className='navigation'>
          <a
            className={`page-link ${activeSection === "tasks" ? "active" : ""}`}
            onClick={() => handleSectionChange("tasks")}
          >
            Tasks
          </a>
          <a
            className={`page-link ${
              activeSection === "referrals" ? "active" : ""
            }`}
            onClick={() => handleSectionChange("referrals")}
          >
            Referrals
          </a>
        </div>
        <div className={`content ${activeSection}`}>
          <div
            className={`task-container ${
              activeSection === "tasks" ? "active" : ""
            }`}
          >
            <TasksList />
          </div>
          <div
            className={`referal-container ${
              activeSection === "referrals" ? "active" : ""
            }`}
          >
            <div className='referal-count'>
              <p className='user-amount'>{invitedReferals}</p>
              <p className='label'>user invited</p>
            </div>
            <Button
              className='btn-primary-50'
              label='Send Invite'
              icon=''
              onClick={() => {}}
            />
            <ReferralsList />
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardCenter;
