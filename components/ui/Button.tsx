import { ReactNode } from "react";

type ButtonVariant = "primary" | "yellow" | "dark";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-[#6D9773] text-white hover:opacity-90",

    yellow:
      "bg-[#FFBA00] text-[#0C3B2E] hover:opacity-90",

    dark:
      "bg-[#0C3B2E] text-white hover:opacity-90",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}

      {icon && icon}
    </button>
  );
}