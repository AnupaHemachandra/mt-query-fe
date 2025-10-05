import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  type = "button", 
  className = "",
  disabled = false,
  variant = "primary",
  size = "md"
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case "primary":
        return "mtq-button-primary";
      case "secondary":
        return "mtq-button-secondary";
      case "success":
        return "mtq-button-success";
      case "warning":
        return "mtq-button-warning";
      case "danger":
        return "mtq-button-danger";
      case "neutral":
        return "mtq-button-neutral";
      default:
        return "mtq-button-primary";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm";
      case "md":
        return "px-6 py-3";
      case "lg":
        return "px-8 py-4 text-lg";
      default:
        return "px-6 py-3";
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getVariantClass()} ${getSizeClass()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
