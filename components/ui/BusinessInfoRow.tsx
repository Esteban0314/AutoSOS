import { ReactNode } from "react";

interface BusinessInfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  action?: ReactNode;
}

export default function BusinessInfoRow({
  icon,
  label,
  value,
  action,
}: BusinessInfoRowProps) {
  return (
    <div className="group flex items-center justify-between border-b border-gray-100 py-3.5 last:border-0 transition hover:bg-[#F8FAF8]/50 px-2 rounded-xl">
      <div className="flex items-center gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E] transition-all group-hover:bg-[#6D9773] group-hover:text-white shadow-xs">
          {icon}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {label}
          </p>

          <p className="mt-0.5 text-sm font-semibold text-[#0C3B2E]">
            {value}
          </p>
        </div>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}