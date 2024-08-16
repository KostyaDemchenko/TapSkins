import React, { useState, useEffect } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TasksList from "@/src/components/TasksList";
import ReferralsList from "@/src/components/Referal";
import Button from "@/src/components/Button";
import Modal from "@/src/components/Modal";

import "./style.scss";

import { SuccessDisplay, User } from "@/src/utils/types";

const toastSettings: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

const RewardCenter: React.FC<{ user: User }> = ({ user }) => {
  const [activeSection, setActiveSection] = useState("tasks");
  const [successClaimedReferal, setSuccessClaimedReferal] =
    useState<SuccessDisplay>({
      message: "",
      success: false,
      loading: false,
    });
  const [referralLink, setReferralLink] = useState<string>("");
  const [copyStatus, setCopyStatus] = useState<"default" | "success" | "error">(
    "default"
  ); // Состояние для статуса копирования

  const handleSectionChange = (section: React.SetStateAction<string>) => {
    setActiveSection(section);
  };

  const handleCopyClick = async () => {
    try {
      if (referralLink) {
        await navigator.clipboard.writeText(referralLink);
        setCopyStatus("success");

        // Показываем тостер
        toast.success("Referral link copied!", toastSettings);

        setTimeout(() => {
          setCopyStatus("default");
        }, 3000); // Возвращаем статус к "default" через 3 секунды
      }
    } catch (error) {
      setCopyStatus("error");
      toast.error("Failed to copy link!", toastSettings);

      setTimeout(() => {
        setCopyStatus("default");
      }, 3000);
    }
  };

  const handleSendInviteClick = () => {
    const message = encodeURIComponent(
      `Here is my referral link: ${referralLink}`
    );
    const shareUrl = `https://t.me/share/url?url=${message}`;

    window.open(shareUrl, "_blank");
  };

  const fetchReferralLink = async () => {
    const response = await user.assemblyReferalLink();
    if (response.success) {
      setReferralLink(response.message);
    } else {
      alert(response.message); // Сообщение об ошибке, если не удалось получить ссылку
    }
  };

  useEffect(() => {
    // Получаем реферальную ссылку при открытии модального окна
    document
      .getElementById("referal-modal-trigger")
      ?.addEventListener("click", fetchReferralLink);
  }, []);

  return (
    <>
      <ToastContainer />
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
            <TasksList user={user} />
          </div>
          <div
            className={`referal-container ${
              activeSection === "referrals" ? "active" : ""
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
              id='referal-modal-trigger'
            />
            {user && (
              <ReferralsList
                setSuccessClaimedReferal={setSuccessClaimedReferal}
                user={user}
              />
            )}
          </div>
        </div>
      </div>
      <Modal
        modalTitle='Send Invite'
        height='65dvh'
        triggerId='referal-modal-trigger'
        className='referal-link-modal'
        closeElement={
          <Button
            label={`Send Invite In Chat`}
            className='btn-primary-50'
            icon=''
            onClick={handleSendInviteClick} // Открываем Telegram для выбора чата
          />
        }
      >
        <p className='description'>
          Invite friends, share your link, and earn bonuses – copy or send it in
          chat now!
        </p>
        <div
          className={`input-container ${
            copyStatus === "success"
              ? "input-success"
              : copyStatus === "error"
              ? "input-error"
              : ""
          }`}
        >
          <input
            className='input-refferal'
            type='text'
            value={referralLink}
            readOnly
          />
          <div className='icon-container'>
            <span
              className='material-symbols-rounded copy-btn'
              onClick={handleCopyClick}
            >
              {copyStatus === "success" ? "done" : "file_copy"}
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RewardCenter;
