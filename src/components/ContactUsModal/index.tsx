import React from "react";
import Image from "next/image";

import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";

import imgObj from "@/public/img/utils";

import "./style.scss";

interface ContactUsModalProps {
  triggerId: string;
}

const ContactUsModal: React.FC<ContactUsModalProps> = ({ triggerId }) => {
  return (
    <Modal
      modalTitle='Contact us'
      height='60dvh'
      triggerId={triggerId}
      className='contact-us-modal'
      closeElement={
        <a className='btn-primary-50' href='https://t.me/dmitro_fewd'>
          Write a Message
        </a>
        // <Button
        //   label={`Confirm`}
        //   className='btn-primary-50'
        //   icon=''
        //   onClick={() => {}}
        // />
      }
    >
      <Image src={imgObj.contactUs} width={160} height={160} alt='Contact us' />
      <div className='desctription-box'>
        <p className='title'>Questions still?</p>
        <p className='description'>
          Write directly to our assistant, managed to answer on your questions.
        </p>
      </div>
    </Modal>
  );
};

export default ContactUsModal;
