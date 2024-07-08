import Image from "next/image";

import "./style.scss";

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  icon?: string;
  iconImg?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  className,
  icon,
  iconImg,
}) => {
  const imageSrc = iconImg ?? "";

  return (
    <button onClick={onClick} disabled={disabled} className={className}>
      {iconImg && (
        <Image
          className='icon-img'
          src={iconImg}
          width={24}
          height={24}
          alt='Filter'
        />
      )}
      {icon && <span className='material-symbols-rounded'>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
