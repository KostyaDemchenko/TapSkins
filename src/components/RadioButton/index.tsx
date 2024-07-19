import React, { useState, useEffect } from "react";
import "./style.scss";

interface CustomRadioButtonProps {
  name: string;
  defaultSelected?: boolean;
  onChange?: (checked: boolean) => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  name,
  defaultSelected = false,
  onChange,
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  useEffect(() => {
    setSelected(defaultSelected);
  }, [defaultSelected]);

  const handleChange = () => {
    setSelected((prevSelected) => {
      const newSelected = !prevSelected;
      if (onChange) {
        onChange(newSelected);
      }
      return newSelected;
    });
  };

  return (
    <label className='custom-radio-button'>
      <input
        type='checkbox'
        checked={selected}
        onChange={handleChange}
        name={name}
      />
      <div className={`radio-button ${selected ? "selected" : ""}`}>
        <div className='inner-circle'></div>
      </div>
    </label>
  );
};

export default CustomRadioButton;
