// default import
import React, { useState } from "react";
import Image from "next/image";

// component import
import iconObj from "@/public/icons/utils";

// style import
import "./style.scss";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className='search-container'>
      <input
        type='text'
        placeholder='Search...'
        className='search-input'
        value={searchTerm}
        onChange={handleSearch}
      />
      <Image
        src={iconObj.search}
        alt='search'
        className='search-icon'
        width={24}
        height={24}
      />
    </div>
  );
};

export default Search;
