import React from "react";

import { colorMap } from "@/src/utils/functions";

import "./style.scss";

interface SkinBackgroundProps {
  imageSrc: string;
  rarity: string;
  id?: string | number;
  size: "small" | "large"; // to handle different sizes for card and modal
}

const SkinBackground: React.FC<SkinBackgroundProps> = ({
  imageSrc,
  rarity,
  size,
  id = "default",
}) => {
  const { color, shadow } = colorMap[rarity];

  const boxSize = size === "small" ? 158 : 320;
  const circleSize = size === "small" ? 95 : 190;

  return (
    <div className='img-box' style={{ width: boxSize, height: boxSize * 0.77 }}>
      <img src={imageSrc} alt={rarity} className='skin-image' />
      <style jsx>{`
        .img-box::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: ${circleSize}px;
          height: ${circleSize}px;
          border-radius: 300px;
          border: 2px solid ${color};
          filter: drop-shadow(0px 0px 15.4px ${shadow});
          z-index: 1;
        }
      `}</style>
    </div>
  );
};

export default SkinBackground;
