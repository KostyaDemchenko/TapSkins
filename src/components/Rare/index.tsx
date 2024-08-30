import React from "react";

import "./style.scss";

interface ColorLabelProps {
  rarity: string;
}

const colorMap: { [key: string]: string } = {
  Common: "#BAC9DA",
  Uncommon: "#5899D3",
  Rare: "#4362E6",
  Mythical: "#713BDB",
  Legendary: "#CD2ADB",
  Ancient: "#D13E3E",
  ExcedinglyRare: "#E5A725",
};

const Rare: React.FC<ColorLabelProps> = ({ rarity }) => {
  const color = colorMap[rarity];

  return (
    <div className='rare-box'>
      <div className='top-box'>
        <p className='rare-text'>Rare</p>
        <div className='rare-details'>
          <div className='color-block' style={{ backgroundColor: color }}></div>
          <span className='rare-name'>{rarity}</span>
        </div>
      </div>
      <div className='bottom-box'>
        <span className='stroke'></span>
      </div>
    </div>
  );
};

export default Rare;
