import React from "react";

import "./style.scss";

interface FloatProps {
  floatValue: number;
}

const Float: React.FC<FloatProps> = ({ floatValue }) => {
  // Обрезаем значение floatValue до двух знаков после запятой
  const truncatedFloatValue = Math.floor(floatValue * 100) / 100;
  const percentageValue = truncatedFloatValue * 100;

  // Определяем секцию и соответствующий цвет
  let sectionColor = "";
  let sectionLabel = "";

  if (truncatedFloatValue <= 0.07) {
    sectionColor = "#00FD00";
    sectionLabel = "Factory New";
  } else if (truncatedFloatValue <= 0.15) {
    sectionColor = "#76F000";
    sectionLabel = "Minimal Wear";
  } else if (truncatedFloatValue <= 0.37) {
    sectionColor = "#FEE200";
    sectionLabel = "Field Tested";
  } else if (truncatedFloatValue <= 0.45) {
    sectionColor = "#FEBB02";
    sectionLabel = "Well-Worn";
  } else {
    sectionColor = "#FF2F09";
    sectionLabel = "Battle-Scarred";
  }

  return (
    <div className='float-box'>
      <div className='top-box'>
        <h3 className='float-title'>Float: {truncatedFloatValue}</h3>
        <p className='float-name' style={{ color: sectionColor }}>
          {sectionLabel}
        </p>
      </div>
      <div className='bottom-box'>
        <div
          className='grad-bar'
          style={{
            background: `linear-gradient(to right, #00FD00 0%, #00FD00 7%, #76F000 7%, #76F000 15%, #FEE200 15%, #FEE200 37%, #FEBB02 37%, #FEBB02 45%, #FF2F09 45%, #FF2F09 100%)`,
          }}
        ></div>
        <div
          className='grad-grey'
          style={{
            width: `${100 - percentageValue}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Float;
