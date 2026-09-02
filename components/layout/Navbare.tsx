"use client";

import Link from "next/link";
import { useState } from "react";
import UserMenu from "@/components/ui/UserMenu";
import {
  Car,
  Home,
  Wrench,
  Brain,
  Menu,
  X,
  PhoneCall,
  Sparkles,
} from "lucide-react";

interface NavbarProps {
  active?: "home" | "services" | "diagnosis" | "parts";
}

export default function Navbar({ active }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    {
      id: "home",
      label: "Inicio",
      href: "/",
      icon: Home,
    },
    {
      id: "services",
      label: "Servicios y Talleres",
      href: "/servicios",
      icon: Wrench,
    },
    {
      id: "diagnosis",
      label: "Diagnóstico IA",
      href: "/#diagnostico",
      icon: Brain,
      badge: "IA",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE7DE]/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0C3B2E] text-white shadow-md transition-all duration-300 group-hover:bg-[#145341] group-hover:scale-105">
            <Car size={22} className="text-[#FFBA00]" />
          </div>

          <span className="text-xl font-extrabold tracking-tight text-[#0C3B2E]">
            Auto<span className="text-[#6D9773]">SOS</span>
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-1.5 md:flex bg-[#F8FAF8] p-1.5 rounded-2xl border border-[#DCE7DE]/60">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = active === link.id;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#0C3B2E] shadow-sm font-bold border border-[#DCE7DE]"
                    : "text-gray-600 hover:text-[#0C3B2E] hover:bg-white/60"
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? "text-[#6D9773]" : "text-gray-400"}
                />
                <span>{link.label}</span>
                {link.badge && (
                  <span className="flex items-center gap-0.5 rounded-full bg-[#FFF4D6] px-1.5 py-0.5 text-[10px] font-extrabold text-[#8C5D00] border border-[#FFE699]">
                    <Sparkles size={10} />
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ACCIONES Y PERFIL */}
        <div className="flex items-center gap-3">
          {/* Botón SOS Emergencia */}
          <a
            href="tel:+59170000000"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100 hover:border-red-300 transition-all shadow-xs active:scale-95"
            title="Línea de emergencia y auxilio mecánico"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <PhoneCall size={13} />
            SOS 24/7
          </a>

          <UserMenu />

          {/* Botón Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DCE7DE] bg-white text-gray-700 md:hidden hover:bg-gray-50 cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="border-b border-[#DCE7DE] bg-white px-6 py-5 md:hidden animate-enter-scale shadow-lg">
          <nav className="flex flex-col gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = active === link.id;

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#E8F0E9] text-[#0C3B2E]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-[#6D9773]" : "text-gray-400"} />
                    <span>{link.label}</span>
                  </div>

                  {link.badge && (
                    <span className="rounded-full bg-[#FFF4D6] px-2 py-0.5 text-[10px] font-bold text-[#8C5D00]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-gray-100 mt-2">
              <a
                href="tel:+59170000000"
                className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-md active:scale-95"
              >
                <PhoneCall size={16} />
                Llamar a Emergencia SOS 24/7
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}