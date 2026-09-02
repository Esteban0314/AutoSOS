import { ReactNode } from "react";

interface ServiceTagProps {
  children: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function ServiceTag({
  children,
  icon,
  active = false,
  onClick,
  className = "",
}: ServiceTagProps) {
  const isClickable = Boolean(onClick);

  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200
        ${
          active
            ? "bg-[#0C3B2E] text-white shadow-xs"
            : "bg-[#E8F0E9]/80 text-[#0C3B2E] border border-[#DCE7DE] hover:bg-[#E8F0E9] hover:border-[#6D9773]"
        }
        ${isClickable ? "cursor-pointer active:scale-95" : ""}
        ${className}
      `}
    >
      {icon && <span className="text-[#6D9773]">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}