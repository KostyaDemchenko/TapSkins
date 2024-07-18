// default import
import React from "react";
import Image from "next/image";

// component import
import iconObj from "@/public/icons/utils";

// style import
import "./style.scss";

interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
  return (
    <div className='search-container'>
      <input type='text' placeholder='Search...' className='search-input' />
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
