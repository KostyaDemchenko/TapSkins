import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@mui/material/Skeleton";
import { SkinCard } from "@/src/components/Carts";
import { ToastContainer, toast, ToastOptions, Id } from "react-toastify";
import { Cart, Skin, SuccessDisplay, User } from "@/src/utils/types";
import "./style.scss";

const toastSettings: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "dark",
};

interface SkinStoreProps {
  searchTerm: string;
  skins: Skin[];
  isLoading: boolean;
  filters: any;
  user: User | null;
}

const SkinStore: React.FC<SkinStoreProps> = ({
  searchTerm,
  skins,
  isLoading,
  filters,
  user,
}) => {
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>(skins);
  const [quickFilteredSkins, setQuickFilteredSkins] = useState<Skin[]>(skins);
  const userCart = useRef<Cart | null>(null);
  const toastId = useRef<Id | null>(null);
  const addingToCart = useRef<boolean>(false);

  useEffect(() => {
    if (user) {
      userCart.current = new Cart(user.getBalancePurple());
    }
  }, [user]);

  // Применяем быстрые фильтры и обновляем состояние `quickFilteredSkins`
  useEffect(() => {
    let quickFiltered = skins;

    // Применяем быстрый фильтр по типу предмета (например, перчатки)
    if (
      filters.itemType &&
      filters.itemType.length > 0 &&
      filters.itemType !== "All"
    ) {
      quickFiltered = quickFiltered.filter((skin) =>
        filters.itemType.includes(skin.weapon_type)
      );
    }

    setQuickFilteredSkins(quickFiltered);
  }, [skins, filters.itemType]);

  // Применяем обычные фильтры и поиск по уже отфильтрованному быстрому списку
  useEffect(() => {
    let finalFiltered = quickFilteredSkins;

    // Применяем поиск по отфильтрованному быстрому списку
    if (searchTerm) {
      finalFiltered = finalFiltered.filter((skin) =>
        skin.skin_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Применяем фильтры по цене
    if (filters.priceRange) {
      finalFiltered = finalFiltered.filter(
        (skin) =>
          skin.price >= filters.priceRange[0] &&
          skin.price <= filters.priceRange[1]
      );
    }

    // Применяем фильтры по float значению
    if (filters.floatRange) {
      finalFiltered = finalFiltered.filter(
        (skin) =>
          skin.float >= filters.floatRange[0] &&
          skin.float <= filters.floatRange[1]
      );
    }

    // Применяем фильтры по типу оружия
    if (filters.weaponType && filters.weaponType.length > 0) {
      finalFiltered = finalFiltered.filter((skin) =>
        filters.weaponType.includes(skin.weapon_type)
      );
    }

    // Применяем фильтры по названию оружия
    if (filters.weapon && filters.weapon.length > 0) {
      finalFiltered = finalFiltered.filter((skin) =>
        filters.weapon.includes(skin.weapon_name)
      );
    }

    // Применяем фильтры по редкости
    if (filters.rarity && filters.rarity.length > 0) {
      finalFiltered = finalFiltered.filter((skin) =>
        filters.rarity.includes(skin.rarity)
      );
    }

    // Применяем фильтр по Startrack
    if (filters.starTrack) {
      finalFiltered = finalFiltered.filter(
        (skin) => skin.startrack === "Startrack"
      );
    }

    setFilteredSkins(finalFiltered);
  }, [searchTerm, quickFilteredSkins, filters]);

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

  const addToCartHandle = async (skin: Skin) => {
    if (addingToCart.current) return;
    addingToCart.current = true;
    toastId.current = toast.loading(
      "Checking skin for availability...",
      toastSettings
    );
    if (!user) {
      toast.update(toastId.current, {
        render: "Error occurred! Reload page please!",
        type: "error",
        isLoading: false,
        hideProgressBar: false,
        autoClose: 3000,
      });
      return;
    }
    const status = (await userCart.current!.addToCart(
      skin,
      user.getInitData()
    )) as SuccessDisplay;

    addingToCart.current = false;
    toast.update(toastId.current, {
      render: status.message,
      type: status.success ? "success" : "error",
      isLoading: false,
      hideProgressBar: false,
      autoClose: 3000,
    });

    if (status.success) {
      // Удаляем скин из списка после успешного добавления в корзину
      removeSkinFromList(skin.item_id);
    }
  };

  const removeSkinFromList = (skinId: number) => {
    setFilteredSkins((prevSkins) =>
      prevSkins.filter((skin) => skin.item_id !== skinId)
    );
  };

  return (
    <>
      <ToastContainer />
      <div className='skin-store-container'>
        {filteredSkins.length === 0 ? (
          <div className='empty-cart'>
            <p>No items by your filters :(</p>
          </div>
        ) : (
          filteredSkins.map((skin) => (
            <SkinCard
              user={user}
              addToCartHandle={addToCartHandle}
              skin={skin}
              key={skin.item_id}
              onSkinActionComplete={removeSkinFromList}
            />
          ))
        )}
      </div>
    </>
  );
};

export default SkinStore;
