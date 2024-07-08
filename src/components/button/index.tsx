import "./style.scss";

interface ButtonProps {
  label: string;
  onClick: () => void;
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
    <button onClick={onClick} disabled={disabled} className={className}>
      {icon && <span className='material-symbols-rounded'>{icon}</span>}
      {label}
    </button>
  );
};

export default Button;
