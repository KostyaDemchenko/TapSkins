import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Head from "next/head";

import { User } from "@/src/utils/types";

import Nav from "@/src/components/Nav";
import UserBalanceStore from "@/src/components/UserBalanceStore";
import FastFilters from "@/src/components/FastFilters";
import SkinStore from "@/src/components/SkinStoreList";
import Filters from "@/src/components/Filters";
import Search from "@/src/components/Search";
import Sort from "@/src/components/Sort";

import "@/src/app/globals.scss";
import "./style.scss";
import { Skin } from "@/src/utils/types";

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
  const userBalance = useRef(0);

  useEffect(() => {
    if (!tg) return;

    tg.expand();
    tg.setHeaderColor("#080918");

    (async () => {
      if (!tg.initDataUnsafe || !tg.initDataUnsafe.user) {
        return;
      }
      const userClass = new User(tg.initDataUnsafe.user.id, tg.initData);
      const response = await userClass.authUser(tg);
      console.log("Sending...");
      if (response) {
        userBalance.current = userClass.getBalancePurple();
        try {
          // const response = await fetch("/api/skin_store");
          // const data = await response.json();
          const data = await userClass.getSkins();
          setSkins(data);
          setFilteredSkins(data);

          const prices = data.map((skin: Skin) => skin.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));

          const floats = data.map((skin: Skin) => skin.float);
          setMinFloat(Math.min(...floats));
          setMaxFloat(Math.max(...floats));

          const uniqueWeaponTypes: string[] = Array.from(
            new Set(
              data.map((skin: Skin) => skin.weapon_type)
            )
          );
          setWeaponTypes(uniqueWeaponTypes);
        } catch (error) {
          console.error("Error fetching the skin store data:", error);
        } finally {
          setIsLoading(false);
        }
        setUser(userClass);
      }
    })();
  }, [tg]);

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
      <Head>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        ></meta>
      </Head>
      <Script
        src='https://telegram.org/js/telegram-web-app.js'
        onLoad={() => {
          setTg(global.window.Telegram.WebApp);
        }}
      />
      <main>
        <div className='container'>
          <div className='middle-box'>
            {user && <UserBalanceStore user={user} />}
            {!user && <UserBalanceStore />}
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
                isLoading={isLoading}
                onFilterSelect={handleWeaponTypeFilter}
              />
              <Sort isLoading={isLoading} onSort={handleSort} />
            </div>
          </div>
          <SkinStore
            user={user}
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
