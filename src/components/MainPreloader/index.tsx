import React, { useEffect, useState } from "react";
import Image from "next/image";

import ProgressBar from "@/src/components/ProgressBar";

import imgObj from "@/public/img/utils";

import "./style.scss";

const Preloader: React.FC<{ duration?: number }> = ({ duration = 3000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalDuration = duration / 100; // Разделяем общую продолжительность на шаги прогресса
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className='preloader'>
      <div className='preloader-content'>
        <div className='app-name'>
          <p>T</p>
          <p>A</p>
          <p>P</p>
          <br />
          <p>S</p>
          <p>K</p>
          <p>I</p>
          <p>N</p>
          <p>S</p>
        </div>
        <Image src={imgObj.preloader} alt='App Prototype' />
        <ProgressBar titleVisible={false} total={100} completed={progress} />
      </div>
    </div>
  );
};

export default Preloader;
