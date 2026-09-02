import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "yellow"
  | "dark"
  | "outline"
  | "ghost"
  | "danger"
  | "sos";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 shadow-xs",
    md: "px-5 py-2.5 text-sm gap-2 shadow-sm",
    lg: "px-6 py-3.5 text-base gap-2.5 shadow-md",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#6D9773] text-white hover:bg-[#5b8361] hover:shadow-md hover:shadow-[#6D9773]/25 focus-visible:ring-2 focus-visible:ring-[#6D9773] focus-visible:ring-offset-2",

    yellow:
      "bg-[#FFBA00] text-[#0C3B2E] hover:bg-[#e5a700] hover:shadow-md hover:shadow-[#FFBA00]/30 font-bold focus-visible:ring-2 focus-visible:ring-[#FFBA00] focus-visible:ring-offset-2",

    dark:
      "bg-[#0C3B2E] text-white hover:bg-[#145341] hover:shadow-lg hover:shadow-[#0C3B2E]/25 focus-visible:ring-2 focus-visible:ring-[#0C3B2E] focus-visible:ring-offset-2",

    outline:
      "border border-[#DCE7DE] bg-white text-[#0C3B2E] hover:bg-[#E8F0E9] hover:border-[#6D9773] focus-visible:ring-2 focus-visible:ring-[#6D9773]",

    ghost:
      "text-[#0C3B2E] hover:bg-[#E8F0E9]/60 hover:text-[#0C3B2E] shadow-none",

    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:shadow-md hover:shadow-red-500/25",

    sos:
      "bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:brightness-105",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={size === "sm" ? 14 : size === "lg" ? 20 : 16} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          <span>{children}</span>
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
}