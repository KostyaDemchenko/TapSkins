import React, { useState, useEffect } from "react";
import Image from "next/image";

import Modal from "@/src/components/Modal";
import { SkinCard } from "@/src/components/Carts";
import SkinBackground from "@/src/components/SkinBackground";
import Button from "@/src/components/Button";
import Rare from "@/src/components/Rare";
import Float from "@/src/components/Float";
import Skeleton from "@mui/material/Skeleton";

import iconObj from "@/public/icons/utils";

import { truncateName } from "@/src/utils/functions";

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

interface SkinStoreProps {
  searchTerm: string;
  skins: Skin[];
  isLoading: boolean;
}

const SkinStore: React.FC<SkinStoreProps> = ({
  searchTerm,
  skins,
  isLoading,
}) => {
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>(skins);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSkins(
        skins.filter((skin) =>
          skin.skin_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSkins(skins);
    }
  }, [searchTerm, skins]);

  if (isLoading) {
    return (
      <div className='skin-store-container'>
        {Array.from(new Array(8)).map((_, index) => (
          <Skeleton
            key={index}
            variant='rounded'
            height={261}
            animation='wave'
            sx={{
              bgcolor: "var(--color-surface)",
              width: "48%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className='skin-store-container'>
      {filteredSkins.map((skin) => (
        <Modal
          key={skin.item_id}
          modalTitle=''
          height='77dvh'
          trigger={<SkinCard skin={skin} />}
        >
          <div className='skin-full-details'>
            <SkinBackground
              imageSrc={skin.image_src}
              rarity={skin.rarity}
              size='large'
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
                <p className='available-user-value'>Sample</p>
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
