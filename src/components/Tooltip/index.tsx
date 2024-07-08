import React from "react";

import { Tooltip } from "react-tooltip";

import "./style.scss";

interface MyTooltipProps {
  tooltipId: string;
  tooltipContent: string;
}

const MyTooltip: React.FC<MyTooltipProps> = ({ tooltipId, tooltipContent }) => {
  return (
    <Tooltip
      id={tooltipId}
      className='my-tooltip'
      place='top'
      offset={1}
      content={tooltipContent}
    />
  );
};

export default MyTooltip;
