import React, { useState, useEffect, useRef } from "react";
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
import { Cart, Skin } from "@/src/utils/types";
import { ToastContainer, toast, ToastOptions } from "react-toastify";

import { SuccessDisplay } from "@/src/utils/types";

import "./style.scss";

interface SkinStoreProps {
  searchTerm: string;
  skins: Skin[];
  isLoading: boolean;
  filters: any;
  userBalance: number;
}

const SkinStore: React.FC<SkinStoreProps> = ({
  searchTerm,
  skins,
  isLoading,
  filters,
  userBalance,
}) => {
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>(skins);

  const userCart = useRef<Cart | null>(null);

  useEffect(() => {
    userCart.current = new Cart(userBalance);
    let filtered = skins;

    if (searchTerm) {
      filtered = filtered.filter((skin) =>
        skin.skin_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(
        (skin) =>
          skin.price >= filters.priceRange[0] &&
          skin.price <= filters.priceRange[1]
      );
    }

    if (filters.floatRange) {
      filtered = filtered.filter(
        (skin) =>
          skin.float >= filters.floatRange[0] &&
          skin.float <= filters.floatRange[1]
      );
    }

    if (filters.weaponType && filters.weaponType.length > 0) {
      filtered = filtered.filter((skin) =>
        filters.weaponType.includes(skin.weapon_type)
      );
    }

    if (filters.weapon && filters.weapon.length > 0) {
      filtered = filtered.filter((skin) =>
        filters.weapon.includes(skin.weapon_name)
      );
    }

    if (filters.rarity && filters.rarity.length > 0) {
      filtered = filtered.filter((skin) =>
        filters.rarity.includes(skin.rarity)
      );
    }

    if (filters.starTrack) {
      filtered = filtered.filter((skin) => skin.startrack === "Startrack");
    }

    setFilteredSkins(filtered);
  }, [searchTerm, skins, filters]);

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

  const addToCartHandle = (skin: Skin) => {
    const status = userCart.current!.addToCart(skin) as SuccessDisplay;
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
    if (status.success) toast.success(status.message, toastSettings);
    else toast.error(status.message, toastSettings);
  };

  return (
    <>
      <ToastContainer />
      <div className='skin-store-container'>
        {filteredSkins.map((skin) => (
          <Modal
            key={skin.item_id}
            modalTitle=''
            height='77dvh'
            trigger={<SkinCard addToCartHandle={addToCartHandle} skin={skin} />}
            closeElement={
              <Button
                label={`Buy Now`}
                className='btn-primary-50'
                icon=''
                onClick={() => {}}
              />
            }
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
            </div>
          </Modal>
        ))}
      </div>
    </>
  );
};

export default SkinStore;
