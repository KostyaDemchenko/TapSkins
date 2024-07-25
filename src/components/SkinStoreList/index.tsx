import React, { useState, useEffect, useRef } from "react";

import Skeleton from "@mui/material/Skeleton";
import { SkinCard } from "@/src/components/Carts";
import { ToastContainer, toast, ToastOptions } from "react-toastify";

import { Cart, Skin, SuccessDisplay } from "@/src/utils/types";

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
              width: "calc(50dvw - 22.5px)",
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
          <SkinCard
            addToCartHandle={addToCartHandle}
            skin={skin}
            key={skin.item_id}
          />
        ))}
      </div>
    </>
  );
};

export default SkinStore;
