import React, { useState, useEffect } from "react";
import Image from "next/image";

import Button from "@/src/components/Button";
import Rare from "@/src/components/Rare";
import Float from "@/src/components/Float";
import Modal from "@/src/components/Modal";
import iconObj from "@/public/icons/utils";

import "./style.scss";

interface Skin {
  item_id: number;
  skin_name: string;
  weapon_name: string;
  image_src: string;
  price: number;
  float: number;
  rarity: string;
  weapon_type: string;
  startrack: string;
}

const truncateName = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

const truncateFloat = (num: number, precision: number) => {
  return num.toFixed(precision);
};

const SkinStore: React.FC = () => {
  const [skins, setSkins] = useState<Skin[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/skin_store");
        const data = await response.json();
        setSkins(data.storeDataStructured);
      } catch (error) {
        console.error("Error fetching the skin store data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='skin-store-container'>
      {skins.map((skin) => (
        <Modal
          key={skin.item_id}
          modalTitle=''
          height='70dvh'
          trigger={
            <div className='skin-card'>
              <img
                src={skin.image_src}
                alt={skin.skin_name}
                className='skin-image'
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
                      <p className='price-value'>{skin.price}</p>
                      <Image
                        src={iconObj.purpleCoin}
                        width={12}
                        height={12}
                        alt='Purple coin'
                      />
                    </div>
                    <p className='float'>
                      Float {truncateFloat(skin.float, 6)}
                    </p>
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
                    onClick={() => {}}
                  />
                </div>
              </div>
            </div>
          }
        >
          <div className='skin-full-details'>
            <img
              src={skin.image_src}
              alt={skin.skin_name}
              className='skin-image'
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
                <p className='available-user-value'>Samle</p>
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
                <p className='price-value'>{skin.price}</p>
                <Image
                  src={iconObj.purpleCoin}
                  width={12}
                  height={12}
                  alt='Purple coin'
                />
              </div>
            </div>
            <Button
              label={`Buy Now`}
              className='btn-primary-50'
              icon=''
              onClick={() => {}}
            />
          </div>
        </Modal>
      ))}
    </div>
  );
};

export default SkinStore;
