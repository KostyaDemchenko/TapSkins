import React from "react";
import "./style.scss";

interface CustomRadioButtonProps {
  selected: boolean;
  onChange: () => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className='custom-radio-button' onClick={onChange}>
      <div className={`radio-button ${selected ? "selected" : ""}`}>
        <div className='inner-circle'></div>
      </div>
    </div>
  );
};

export default CustomRadioButton;
