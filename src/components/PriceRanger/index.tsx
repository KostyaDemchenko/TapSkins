import React, { useState } from "react";
import Image from "next/image";
import { RangeSlider } from "rsuite";
import iconObj from "@/public/icons/utils";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./style.scss";

interface PriceRangerProps {
  maxValue: number;
  minValue: number;
  rangeTitle: string;
  icons?: boolean;
}

const PriceRanger: React.FC<PriceRangerProps> = ({
  maxValue,
  minValue,
  rangeTitle,
  icons = true,
}) => {
  const [range, setRange] = useState<[number, number]>([minValue, maxValue]);

  const handleChange = (value: [number, number]) => {
    setRange(value);
    console.log("Current Range Values:", value);
  };

  return (
    <div className='price-ranger'>
      <div className='top-box'>
        <h3 className='range-title'>{rangeTitle}</h3>
        <div className='from-to'>
          <div className='from'>
            <p>{range[0]}</p>
            {icons && (
              <Image
                src={iconObj.purpleCoin}
                width={12}
                height={12}
                alt='Purple coin'
              />
            )}
          </div>
          <p>-</p>
          <div className='to'>
            <p>{range[1]}</p>
            {icons && (
              <Image
                src={iconObj.purpleCoin}
                width={12}
                height={12}
                alt='Purple coin'
              />
            )}
          </div>
        </div>
      </div>
      <div className='range-box'>
        <RangeSlider
          max={maxValue}
          defaultValue={range}
          onChange={handleChange} // тут должна быть обработка значений от и до при изменении
        />
      </div>
    </div>
  );
};

export default PriceRanger;
