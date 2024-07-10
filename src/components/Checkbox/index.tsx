import React, { useState } from "react";
import "./style.scss";

interface CustomCheckboxProps {
  name: string;
  defaultChecked?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  defaultChecked = false,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <label className='custom-checkbox'>
      <input
        type='checkbox'
        checked={checked}
        onChange={handleChange}
        name={name}
      />
      <div className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && (
          <span className='material-symbols-outlined icon'>check</span>
        )}
      </div>
    </label>
  );
};

export default CustomCheckbox;
