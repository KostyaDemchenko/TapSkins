import React, { useState, useEffect } from "react";
import Script from "next/script";

import Nav from "@/src/components/Nav";
import SkinStore from "@/src/components/SkinStoreList";
import Filters from "@/src/components/Filters";
import Search from "@/src/components/Search";
import { User } from "@/src/utils/types";

import "@/src/app/globals.scss";
import "./style.scss";

const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

export default function SkinStorePage() {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [skins, setSkins] = useState([]);
  const [filteredSkins, setFilteredSkins] = useState([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minFloat, setMinFloat] = useState<number | null>(null);
  const [maxFloat, setMaxFloat] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

        const prices = data.storeDataStructured.map((skin: any) => skin.price);
        setMinPrice(Math.min(...prices));
        setMaxPrice(Math.max(...prices));

        const floats = data.storeDataStructured.map((skin: any) => skin.float);
        setMinFloat(Math.min(...floats));
        setMaxFloat(Math.max(...floats));
      } catch (error) {
        console.error("Error fetching the skin store data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = (filters: any) => {
    const { priceRange, floatRange } = filters;
    setFilteredSkins(
      skins.filter(
        (skin: any) =>
          skin.price >= priceRange[0] &&
          skin.price <= priceRange[1] &&
          skin.float >= floatRange[0] &&
          skin.float <= floatRange[1]
      )
    );
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
              <Search onSearch={setSearchTerm} />
              <Filters
                minPrice={minPrice ?? 0}
                maxPrice={maxPrice ?? 100}
                minFloat={minFloat ?? 0}
                maxFloat={maxFloat ?? 1}
                onApply={applyFilters}
              />
            </div>
            <div className='bottom-box'>
              <div className='selected-categories-box'></div>
              <div className='sort-modal-triger'></div>
            </div>
          </div>
          <SkinStore
            searchTerm={searchTerm}
            skins={filteredSkins}
            isLoading={isLoading}
          />{" "}
        </div>
      </main>
      <Nav />
    </>
  );
}
