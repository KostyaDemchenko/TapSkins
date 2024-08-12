import React, { useMemo } from "react";

// Component import
import { OrderCartTrigger, SkinOrderCard } from "@/src/components/Carts";
import Modal from "@/src/components/Modal";
import Button from "@/src/components/Button";
import ContactUsModal from "@/src/components/ContactUsModal";

// Types
import { OrderHistiryData } from "@/src/utils/types";

// Style import
import "./style.scss";

interface HistoryorderListProps {
  info: OrderHistiryData[];
}

const HistoryorderList: React.FC<HistoryorderListProps> = ({ info }) => {
  const groupedOrders = useMemo(() => {
    const orderMap = new Map<number, OrderHistiryData[]>();

    info.forEach((order) => {
      if (!orderMap.has(order.order_id)) {
        orderMap.set(order.order_id, []);
      }
      orderMap.get(order.order_id)?.push(order);
    });

    return Array.from(orderMap.values());
  }, [info]);

  // Функция для определения цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "var(--color-system-yellow-dark)";
      case "Done":
        return "var(--color-system-green)";
      case "Canceled":
        return "var(--color-system-red)";
      default:
        return "inherit"; // Используем цвет по умолчанию, если статус не соответствует ни одному из известных
    }
  };

  return (
    <div className='history-order-list'>
      <div className='container'>
        {groupedOrders.map((orderGroup) => {
          const orderId = orderGroup[0].order_id;
          const combinedSkinNames = orderGroup
            .map((o) => o.skin_name)
            .join(", ");
          const combinedSkins = orderGroup.map((o) => ({
            skin_name: o.skin_name,
            image_src: o.image_src,
            rarity: o.rarity,
            price: o.price,
            float: o.float,
            startrack: o.startrack,
            item_id: o.item_id,
            weapon_name: "Some Weapon Name",
            weapon_type: "Some Weapon Type",
          }));

          return (
            <React.Fragment key={orderId}>
              <OrderCartTrigger
                id={`modalOrderInfoTrigger-${orderId}`}
                order_id={orderId}
                order_content={combinedSkinNames}
              />

              <Modal
                modalTitle={`Order #${orderId}`}
                height='75dvh'
                className='order-info-modal'
                triggerId={`modalOrderInfoTrigger-${orderId}`}
              >
                <div className='order-info'>
                  <div className='order-info-status-box'>
                    <p className='order-info-status-title'>Status:</p>
                    <p
                      className='order-info-status'
                      style={{ color: getStatusColor(orderGroup[0].status) }} // Применяем цвет статуса
                    >
                      {orderGroup[0].status}
                    </p>
                  </div>
                  <p className='items-amount'>Items ({orderGroup.length})</p>
                </div>
                <div className='skin-order-cards-container'>
                  {combinedSkins.map((skin, index) => (
                    <SkinOrderCard
                      key={index}
                      skin={skin}
                      showDeleteIcon={false}
                      deleteHandle={() => {}}
                    />
                  ))}
                </div>
                <Button
                  label={`Support Center`}
                  className='btn-primary-50 bg-secondary'
                  icon=''
                  id='contactUsModalTrigger'
                />
                <ContactUsModal
                  fade={false}
                  subModal={true}
                  height='75dvh'
                  triggerId='contactUsModalTrigger'
                />
              </Modal>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default HistoryorderList;
