import React from "react";

// Component import
import { OrderCartTrigger, SkinOrderCard } from "@/src/components/Carts";
import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";
import ContactUsModal from "@/src/components/ContactUsModal";

// Types
import { OrderHistiryData, Skin } from "@/src/utils/types"; // убедитесь, что тип Skin импортирован

// Style import
import "./style.scss";

interface HistoryorderListProps {
  info: OrderHistiryData[];
}

const HistoryorderList: React.FC<HistoryorderListProps> = ({ info }) => {
  if (!info) {
    return <p>Loading...</p>; // пока данные загружаются
  }

  // Функция-обработчик для удаления заказа (пока просто заглушка)
  const handleDelete = (order_id: number) => {
    console.log(`Order ${order_id} deleted`);
    // Здесь можно добавить логику для удаления заказа
  };

  return (
    <>
      {info.map((order) => (
        <React.Fragment key={order.order_id}>
          <OrderCartTrigger
            id={`modalOrderInfoTrigger-${order.order_id}`}
            order_id={order.order_id}
            order_content={order.skin_name}
          />

          <Modal
            modalTitle={`Order ${order.order_id}`}
            height='75dvh'
            className='order-info-modal'
            triggerId={`modalOrderInfoTrigger-${order.order_id}`}
          >
            <SkinOrderCard
              skin={{
                skin_name: order.skin_name,
                image_src: order.image_src,
                rarity: order.rarity,
                price: order.price,
                float: order.float,
                startrack: order.startrack,
                item_id: order.item_id, // добавляем item_id
                weapon_name: "Some Weapon Name", // добавляем weapon_name, если оно не приходит в API, нужно его учитывать
                weapon_type: "Some Weapon Type", // добавляем weapon_type, аналогично
              }}
              deleteHandle={() => handleDelete(order.order_id)} // передаем функцию удаления
            />
            <Button
              label={`Got It`}
              className='btn-primary-50'
              icon=''
              id='contactUsModalTrigger'
            />
          </Modal>
        </React.Fragment>
      ))}
      <ContactUsModal triggerId='contactUsModalTrigger' />
    </>
  );
};

export default HistoryorderList;
