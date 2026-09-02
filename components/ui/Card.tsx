import { ReactNode } from "react";

export type CardVariant = "default" | "glass" | "forest" | "interactive";

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export default function Card({
  children,
  variant = "default",
  className = "",
  onClick,
  hoverEffect = false,
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default:
      "bg-white border border-[#DCE7DE] text-[#0C3B2E] shadow-sm",
    glass:
      "glass-panel text-[#0C3B2E] shadow-sm",
    forest:
      "bg-[#0C3B2E] border border-[#145341] text-white shadow-md",
    interactive:
      "bg-white border border-[#DCE7DE] text-[#0C3B2E] shadow-sm hover:border-[#6D9773] hover:shadow-md hover:-translate-y-1 cursor-pointer",
  };

  const hoverClass =
    hoverEffect && variant !== "interactive"
      ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#6D9773]/60"
      : "transition-all duration-200";

  return (
    <div
      onClick={onClick}
      className={`
        rounded-3xl p-6 overflow-hidden
        ${variantStyles[variant]}
        ${hoverClass}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

