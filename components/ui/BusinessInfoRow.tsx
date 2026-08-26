import { ReactNode } from "react";

interface BusinessInfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

export default function BusinessInfoRow({
  icon,
  label,
  value,
}: BusinessInfoRowProps) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-100 py-4 last:border-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
        {icon}
      </div>

      <div>
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-medium text-[#0C3B2E]">
          {value}
        </p>
      </div>
    </div>
  );
}