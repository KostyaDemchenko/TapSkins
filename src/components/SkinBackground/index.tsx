import React from "react";
import { colorMap } from "@/src/utils/functions";
import "./style.scss";

interface SkinBackgroundProps {
  imageSrc: string;
  rarity: string;
  id?: string;
  size: "small" | "medium" | "large"; // добавлен новый размер "medium"
}

const SkinBackground: React.FC<SkinBackgroundProps> = ({
  imageSrc,
  rarity,
  size,
  id = "default",
}) => {
  const { color, shadow } = colorMap[rarity];

  let boxSize, circleSize;

  switch (size) {
    case "small":
      boxSize = { width: 158, height: 105 };
      circleSize = 95;
      break;
    case "medium":
      boxSize = { width: 158, height: 105 };
      circleSize = 95;
      break;
    case "large":
      boxSize = { width: 320, height: 320 * 0.77 };
      circleSize = 190;
      break;
    default:
      boxSize = { width: 158, height: 105 };
      circleSize = 95;
      break;
  }

  return (
    <div
      className='img-box'
      style={{ width: boxSize.width, height: boxSize.height }}
      id={id}
    >
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
