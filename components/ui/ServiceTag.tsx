interface ServiceTagProps {
  children: string;
}

export default function ServiceTag({
  children,
}: ServiceTagProps) {
  return (
    <span className="rounded-lg bg-[#E8F0E9] px-3 py-2 text-sm font-medium text-[#0C3B2E]">
      {children}
    </span>
  );
}