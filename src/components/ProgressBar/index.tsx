import React from "react";
import "./style.scss";

interface ProgressBarProps {
  completed: number;
  total: number;
  title: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  title,
}) => {
  const percentage = (completed / total) * 100;

  return (
    <div className='progress-bar-container'>
      <div className='progress-bar-info'>
        <div className='progress-bar-count'>
          <p>{completed}</p>
          <p>/{total}</p>
        </div>
        <h3 className='progress-bar-title'> {title}</h3>
      </div>

      <div className='progress-bar'>
        <div
          className='progress-bar__fill'
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
