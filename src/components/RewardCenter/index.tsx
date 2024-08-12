import React, { useState } from "react";

import TasksList from "@/src/components/TasksList";
import ReferralsList from "@/src/components/Referal";
import Button from "@/src/components/Button";

import "./style.scss";
import { SuccessDisplay, User } from "@/src/utils/types";

const RewardCenter: React.FC<{ user: User }> = ({ user }) => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [successClaimedReferal, setSuccessClaimedReferal] = useState<SuccessDisplay>({
    message: "",
    success: false,
    loading: false
  });

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
            className={`page-link ${activeSection === "referrals" ? "active" : ""
              }`}
            onClick={() => handleSectionChange("referrals")}
          >
            Referrals
          </a>
        </div>
        <div className={`content ${activeSection}`}>
          <div
            className={`task-container ${activeSection === "tasks" ? "active" : ""
              }`}
          >
            <TasksList user={user} />
          </div>
          <div
            className={`referal-container ${activeSection === "referrals" ? "active" : ""
              }`}
          >
            <div className='referal-count'>
              <p className='user-amount'>{user.invited_users}</p>
              <p className='label'>user invited</p>
            </div>
            <Button
              className='btn-primary-50'
              label='Send Invite'
              icon=''
              onClick={async () => {
                const response = await user.assemblyReferalLink();
                
                if (response.success) {
                  const referalLink = response.message;
                }
                else {
                  // вывести тоастер, в который передать response.message ( там будет сообщение про ошибку )
                }
              }}
            />
            {user && <ReferralsList setSuccessClaimedReferal={setSuccessClaimedReferal} user={user} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardCenter;
