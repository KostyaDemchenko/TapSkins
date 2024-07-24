import React from "react";

import Skeleton from "@mui/material/Skeleton";

import "./style.scss";

interface ProgressBarProps {
  completed: number;
  total: number;
  title?: string;
  titleVisible: boolean;
  isLoading?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  title,
  titleVisible = true,
  isLoading,
}) => {
  const percentage = (completed / total) * 100;

  return (
    <div className='progress-bar-container'>
      {titleVisible && (
        <div className='progress-bar-info'>
          <div className='progress-bar-count'>
            {isLoading ? (
              <>
                <Skeleton
                  variant='text'
                  width={80}
                  sx={{
                    bgcolor: "var(--color-surface)",
                  }}
                />
              </>
            ) : (
              <>
                <p>{completed}</p>
                <p>/{total}</p>
              </>
            )}
          </div>
          {title &&
            (isLoading ? (
              <Skeleton
                variant='text'
                width={80}
                sx={{
                  bgcolor: "var(--color-surface)",
                }}
              />
            ) : (
              <h3 className='progress-bar-title'>{title}</h3>
            ))}
        </div>
      )}
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
