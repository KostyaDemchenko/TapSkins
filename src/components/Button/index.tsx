import Image from "next/image";

import "./style.scss";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  icon?: string;
  id?: string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  className,
  icon,
  id,
}) => {
  return (
    <button id={id} onClick={onClick} disabled={disabled} className={className}>
      {icon && <span className='material-symbols-rounded'>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
