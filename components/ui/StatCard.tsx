import { ReactNode } from "react";
import Card from "./Card";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className = "",
}: StatCardProps) {
  return (
    <Card hoverEffect className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#6D9773]">
            {title}
          </p>
          <h4 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0C3B2E]">
            {value}
          </h4>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}

          {trend && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
              <span
                className={`
                  rounded-full px-2 py-0.5
                  ${
                    trend.isPositive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                  }
                `}
              >
                {trend.value}
              </span>
              <span className="text-gray-400 font-normal">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E] transition-all duration-300 group-hover:scale-110">
          {icon}
        </div>
      </div>
    </Card>
  );
}

