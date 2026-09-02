import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
  count?: string;
  gradient?: "forest" | "sage" | "amber";
}

export default function ServiceCard({
  icon,
  title,
  description,
  href = "#",
  badge,
  count,
  gradient = "sage",
}: ServiceCardProps) {
  const gradientStyles = {
    forest: "from-[#0C3B2E] to-[#145341] text-white",
    sage: "from-[#6D9773] to-[#4d7c55] text-white",
    amber: "from-[#FFBA00] to-[#e5a700] text-[#0C3B2E]",
  };

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-3xl border border-[#DCE7DE] bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#6D9773] hover:shadow-xl hover:shadow-[#6D9773]/15 cursor-pointer"
    >
      {/* Ambient background glow on hover */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#E8F0E9] opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />

      <div className="flex items-start justify-between">
        {/* Icon with gradient badge */}
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientStyles[gradient]} shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
        >
          {icon}
        </div>

        {badge && (
          <span className="rounded-full bg-[#FFF4D6] border border-[#FFE699] px-2.5 py-1 text-xs font-bold text-[#8C5D00]">
            {badge}
          </span>
        )}

        {count && (
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
            {count}
          </span>
        )}
      </div>

      <h3 className="mt-6 text-xl font-bold tracking-tight text-[#0C3B2E] transition-colors group-hover:text-[#6D9773]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
        {description}
      </p>

      <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-[#6D9773] transition-all group-hover:text-[#0C3B2E]">
        <span>Explorar disponibles</span>
        <ChevronRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1.5"
        />
      </div>
    </Link>
  );
}