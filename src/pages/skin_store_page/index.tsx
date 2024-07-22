import React, { useState, useEffect } from "react";
import Script from "next/script";

import { User } from "@/src/utils/types";

import Nav from "@/src/components/Nav";
import FastFilters from "@/src/components/FastFilters";
import SkinStore from "@/src/components/SkinStoreList";
import Filters from "@/src/components/Filters";
import Search from "@/src/components/Search";
import Sort from "@/src/components/Sort";

import "@/src/app/globals.scss";
import "./style.scss";

type Skin = {
  item_id: number;
  skin_name: string;
  weapon_name: string;
  image_src: string;
  price: number;
  float: number;
  rarity: string;
  weapon_type: string;
  startrack: string;
};

const rarityOrder = [
  "Common",
  "Uncommon",
  "Rare",
  "Mythical",
  "Legendary",
  "Ancient",
  "ExcedinglyRare",
];

export default function SkinStorePage() {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [skins, setSkins] = useState<Skin[]>([]);
  const [filteredSkins, setFilteredSkins] = useState<Skin[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minFloat, setMinFloat] = useState<number | null>(null);
  const [maxFloat, setMaxFloat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<any>({});
  const [weaponTypes, setWeaponTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>("relevant");

  useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id);
      const response = await userClass.authUser(tg);

      if (response) setUser(userClass);
    })();
  }, [tg]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/skin_store");
        const data = await response.json();
        setSkins(data.storeDataStructured);
        setFilteredSkins(data.storeDataStructured);

        const prices = data.storeDataStructured.map((skin: Skin) => skin.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));

        const floats = data.storeDataStructured.map((skin: Skin) => skin.float);
        setMinFloat(Math.min(...floats));
        setMaxFloat(Math.max(...floats));

        const uniqueWeaponTypes: string[] = Array.from(
          new Set(
            data.storeDataStructured.map((skin: Skin) => skin.weapon_type)
          )
        );
        setWeaponTypes(uniqueWeaponTypes);
      } catch (error) {
        console.error("Error fetching the skin store data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (filters: any) => {
    const filtered = skins.filter((skin: Skin) => {
      return (
        (filters.priceRange[0] === null ||
          skin.price >= filters.priceRange[0]) &&
        (filters.priceRange[1] === null ||
          skin.price <= filters.priceRange[1]) &&
        (filters.floatRange[0] === null ||
          skin.float >= filters.floatRange[0]) &&
        (filters.floatRange[1] === null ||
          skin.float <= filters.floatRange[1]) &&
        (filters.weapon.length === 0 ||
          filters.weapon.includes(skin.weapon_name)) &&
        (!filters.starTrack || skin.startrack === "Startrack") &&
        (filters.rarity.length === 0 || filters.rarity.includes(skin.rarity))
      );
    });
    setFilteredSkins(filtered);
    setFilters(filters);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = skins.filter(
      (skin: Skin) =>
        skin.skin_name.toLowerCase().includes(term.toLowerCase()) ||
        skin.weapon_name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredSkins(filtered);
  };

  const handleWeaponTypeFilter = (weaponType: string) => {
    if (weaponType === "All") {
      setFilteredSkins(skins);
    } else {
      const filtered = skins.filter(
        (skin: Skin) => skin.weapon_type === weaponType
      );
      setFilteredSkins(filtered);
    }
  };

  const handleSort = (sortOption: string) => {
    setSortOption(sortOption);
  };

  const getSortedSkins = () => {
    let sortedSkins = [...filteredSkins];

    switch (sortOption) {
      case "price_low_to_high":
        sortedSkins.sort((a, b) => a.price - b.price);
        break;
      case "price_high_to_low":
        sortedSkins.sort((a, b) => b.price - a.price);
        break;
      case "rarity_low_to_high":
        sortedSkins.sort(
          (a, b) =>
            rarityOrder.indexOf(a.rarity) - rarityOrder.indexOf(b.rarity)
        );
        break;
      case "rarity_high_to_low":
        sortedSkins.sort(
          (a, b) =>
            rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity)
        );
        break;
      default:
        break;
    }

    return sortedSkins;
  };

  return (
    <>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      <main>
        <div className='container'>
          <div className='top-box'>
            <div className='user-balance'></div>
            <div className='modal-trigger-convert'></div>
          </div>
          <div className='middle-box'>
            <div className='top-box'>
              <Search onSearch={handleSearch} />
              <Filters
                minPrice={minPrice ?? 0}
                maxPrice={maxPrice ?? 100}
                minFloat={minFloat ?? 0}
                maxFloat={maxFloat ?? 1}
                skins={skins}
                onApply={applyFilters}
              />
            </div>
            <div className='bottom-box'>
              <FastFilters
                weaponTypes={weaponTypes}
                onFilterSelect={handleWeaponTypeFilter}
              />
              <Sort onSort={handleSort} />
            </div>
          </div>
          <SkinStore
            searchTerm={searchTerm}
            skins={getSortedSkins()}
            isLoading={isLoading}
            filters={filters}
          />
        </div>
      </main>
      <Nav />
    </>
  );
}
