import React, { useEffect, useState } from "react";
import Image from "next/image";

import ProgressBar from "@/src/components/ProgressBar";

import imgObj from "@/public/img/utils";

import "./style.scss";

const Preloader: React.FC<{ duration?: number }> = ({ duration = 3000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const intervalDuration = duration / 100;
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className='preloader'>
      <div className='preloader-content'>
        <Image
          src={imgObj.main_preloader}
          alt='App Prototype'
          placeholder='blur'
          priority
        />
        <ProgressBar titleVisible={false} total={100} completed={progress} />
      </div>
    </div>
  );
};

export default Preloader;
