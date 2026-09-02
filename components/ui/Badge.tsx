import { ReactNode } from "react";

export type BadgeVariant =
  | "forest"
  | "sage"
  | "amber"
  | "danger"
  | "neutral"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  withDot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

export default function Badge({
  children,
  variant = "sage",
  size = "md",
  icon,
  withDot = false,
  pulseDot = false,
  className = "",
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    forest: {
      container: "bg-[#0C3B2E] text-white border border-[#145341]",
      dot: "bg-[#6D9773]",
    },
    sage: {
      container: "bg-[#E8F0E9] text-[#0C3B2E] border border-[#DCE7DE]",
      dot: "bg-[#6D9773]",
    },
    amber: {
      container: "bg-[#FFF4D6] text-[#8C5D00] border border-[#FFE699]",
      dot: "bg-[#FFBA00]",
    },
    danger: {
      container: "bg-red-50 text-red-700 border border-red-200",
      dot: "bg-red-500",
    },
    neutral: {
      container: "bg-gray-100 text-gray-700 border border-gray-200",
      dot: "bg-gray-400",
    },
    outline: {
      container: "bg-transparent text-[#0C3B2E] border border-[#DCE7DE]",
      dot: "bg-[#6D9773]",
    },
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2.5 py-0.5 text-xs gap-1.5",
    md: "px-3 py-1 text-xs font-semibold gap-2",
  };

  const currentStyle = variantStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium transition-all
        ${sizeStyles[size]}
        ${currentStyle.container}
        ${className}
      `}
    >
      {withDot && (
        <span
          className={`
            h-2 w-2 rounded-full shrink-0
            ${currentStyle.dot}
            ${pulseDot ? "animate-live-dot" : ""}
          `}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}

