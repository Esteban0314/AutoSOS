import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}

export default function ServiceCard({
  icon,
  title,
  description,
  href = "#",
}: ServiceCardProps) {
  return (
   <Link
    href={href}
    className="group block rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#6D9773] hover:shadow-md"
    >

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E] transition group-hover:bg-[#6D9773] group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-5 text-gray-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1 text-sm font-semibold text-[#6D9773]">
        Explorar
        <ChevronRight size={16} />
      </div>

    </Link>
  );
}