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
          <SkinCard
            addToCartHandle={addToCartHandle}
            skin={skin}
            key={skin.id}
          />
        ))}
      </div>
    </>
  );
};

export default SkinStore;
