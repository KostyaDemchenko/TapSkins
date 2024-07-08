import React, { useState } from "react";

import Button from "@/components/button";

import { RangeSlider } from "rsuite";
import Rodal from "rodal";
import { Tooltip } from "react-tooltip";

import "rsuite/dist/rsuite-no-reset.min.css";
import "rodal/lib/rodal.css";
import "./style.scss";

interface ComponentsProps {
  // Add any props you need here
}

const Components: React.FC<ComponentsProps> = () => {
  // RangeSlider
  const maxValue = 50;
  const minValue = 0;

  const handleChange = (value: [number, number]) => {
    console.log("Current Range Values:", value);
  };

  // Rodal
  const [visible, setVisible] = useState(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return (
    <div>
      <RangeSlider
        max={maxValue}
        defaultValue={[minValue, maxValue]}
        onChange={handleChange}
      />
      <Button
        label='Show modal'
        className='btn-primary-50 icon'
        onClick={show}
      />

      <Rodal
        visible={visible}
        onClose={hide}
        animation='slideUp'
        showCloseButton={false}
        customStyles={{ width: "100dvw", height: "60dvh" }}
      >
        <div>Content</div>
      </Rodal>

      <Button
        label='Tooltip'
        className='btn-primary-50 tooltip'
        onClick={() => console.log("test")}
      />
      <Tooltip anchorSelect='.tooltip' place='top'>
        СУКА!!!!!!!
      </Tooltip>
    </div>
  );
};

export default Components;
