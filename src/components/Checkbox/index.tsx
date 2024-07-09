import React from "react";

import "./style.scss";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className='custom-checkbox' onClick={onChange}>
      <div className={`checkbox ${checked ? "checked" : ""}`}>
        {checked && (
          <span className='material-symbols-outlined icon'>check</span>
        )}
      </div>
    </div>
  );
};

export default CustomCheckbox;
