import React, { useState } from "react";
import "./style.scss";

interface CustomRadioButtonProps {
  name: string;
  defaultSelected?: boolean;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  name,
  defaultSelected = false,
}) => {
  const [selected, setSelected] = useState(defaultSelected);

  const handleChange = () => {
    setSelected((prevSelected) => !prevSelected);
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
