import React, { useState, useEffect } from "react";
import { colorMap } from "@/src/utils/functions";
import "./style.scss";

interface CustomCheckboxProps {
  name: string;
  label: string;
  defaultChecked?: boolean;
  colorBlock?: boolean;
  onChange?: (checked: boolean) => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  name,
  label,
  defaultChecked = false,
  colorBlock = false,
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
      <div className='left-site'>
        {colorBlock && (
          <span
            className='color-block'
            style={{
              backgroundColor: colorMap[label]?.color || "transparent",
              boxShadow: `0 0 5px ${colorMap[label]?.shadow || "transparent"}`,
            }}
          ></span>
        )}
        <span className='checkbox-label'>{label}</span>
      </div>
      <div className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && (
          <span className='material-symbols-outlined icon'>check</span>
        )}
      </div>
    </label>
  );
};

export default CustomCheckbox;
