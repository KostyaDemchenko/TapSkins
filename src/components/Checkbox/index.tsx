import React, { useState, useEffect } from "react";
import "./style.scss";

interface CustomCheckboxProps {
  name: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  defaultChecked = false,
  onChange,
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  const handleChange = () => {
    setChecked((prevChecked) => {
      const newChecked = !prevChecked;
      if (onChange) {
        onChange(newChecked);
      }
      return newChecked;
    });
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
