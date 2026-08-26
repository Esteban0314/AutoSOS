import Link from "next/link";
import {
  Car,
  Home,
  Wrench,
  Brain,
  ShoppingBag,
} from "lucide-react";

import Button from "../ui/Button";

interface NavbarProps {
  active?: "home" | "services" | "diagnosis" | "parts";
}

export default function Navbar({
  active,
}: NavbarProps) {
  const links = [
    {
      id: "home",
      label: "Inicio",
      href: "/",
      icon: Home,
    },
    {
      id: "services",
      label: "Servicios",
      href: "/servicios",
      icon: Wrench,
    },
    {
      id: "diagnosis",
      label: "Diagnóstico IA",
      href: "/diagnostico",
      icon: Brain,
    },
    {
      id: "parts",
      label: "Repuestos",
      href: "/repuestos",
      icon: ShoppingBag,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0C3B2E]">
            <Car
              size={22}
              className="text-white"
            />
          </div>

          <span className="text-xl font-bold tracking-tight text-[#0C3B2E]">
            AutoSOS
          </span>
        </Link>


        {/* NAVEGACIÓN */}

        <nav className="hidden items-center gap-2 md:flex">

          {links.map((link) => {

            const Icon = link.icon;

            const isActive = active === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#E8F0E9] text-[#0C3B2E]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#0C3B2E]"
                }`}
              >
                <Icon size={17} />

                {link.label}
              </Link>
            );
          })}

        </nav>


        {/* PERFIL */}

        <Button>
          Mi perfil
        </Button>

      </div>

    </header>
  );
}