import React, { useState, useEffect } from "react";
import Image from "next/image";
import { RangeSlider } from "rsuite";
import iconObj from "@/public/icons/utils";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./style.scss";

interface PriceRangerProps {
  maxValue: number;
  minValue: number;
  rangeTitle: string;
  step: number;
  icons?: boolean;
  onChange: (value: [number, number]) => void;
}

const PriceRanger: React.FC<PriceRangerProps> = ({
  maxValue,
  minValue,
  rangeTitle,
  step,
  icons = true,
  onChange,
}) => {
  const [range, setRange] = useState<[number, number]>([minValue, maxValue]);

  useEffect(() => {
    setRange([minValue, maxValue]);
  }, [minValue, maxValue]);

  const handleChange = (value: [number, number]) => {
    const truncatedValue: [number, number] = [
      parseFloat(value[0].toFixed(5)),
      parseFloat(value[1].toFixed(5)),
    ];
    setRange(truncatedValue);
    onChange(truncatedValue);
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
          min={minValue}
          max={maxValue}
          step={step}
          value={range}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PriceRanger;
