import React from "react";
import "./style.scss";

interface SkinBackgroundProps {
  imageSrc: string;
  rarity: string;
  size: "small" | "large"; // to handle different sizes for card and modal
}

const colorMap: { [key: string]: { color: string; shadow: string } } = {
  Common: { color: "#BAC9DA", shadow: "rgba(186, 201, 218, 0.75)" },
  Uncommon: { color: "#5899D3", shadow: "rgba(88, 153, 211, 0.75)" },
  Rare: { color: "#4362E6", shadow: "rgba(67, 98, 230, 0.75)" },
  Mythical: { color: "#713BDB", shadow: "rgba(113, 59, 219, 0.75)" },
  Legendary: { color: "#CD2ADB", shadow: "rgba(205, 42, 219, 0.75)" },
  Ancient: { color: "#D13E3E", shadow: "rgba(209, 62, 62, 0.75)" },
  "Exceedingly rare": { color: "#E5A725", shadow: "rgba(229, 167, 37, 0.75)" },
};

const SkinBackground: React.FC<SkinBackgroundProps> = ({
  imageSrc,
  rarity,
  size,
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
