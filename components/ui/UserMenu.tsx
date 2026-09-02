"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Car,
} from "lucide-react";
import Badge from "./Badge";

export default function UserMenu() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-28 rounded-xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="
            inline-flex items-center justify-center
            bg-[#6D9773]
            text-white
            px-5
            py-2.5
            rounded-xl
            text-sm
            font-bold
            shadow-sm
            hover:bg-[#5b8361]
            hover:shadow-md
            hover:shadow-[#6D9773]/20
            transition-all
            duration-200
            active:scale-95
          "
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-3 rounded-2xl p-1.5 pr-3 transition-all duration-200 cursor-pointer
          ${open ? "bg-[#E8F0E9] ring-2 ring-[#6D9773]/30" : "hover:bg-[#E8F0E9]/60"}
        `}
      >
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0C3B2E] text-white font-bold text-sm shadow-md border-2 border-[#FFBA00]/40">
          {user.name.charAt(0).toUpperCase()}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400" />
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-sm font-bold text-[#0C3B2E] leading-tight">
            {user.name}
          </p>
          <div className="mt-0.5">
            <span className="text-[11px] font-semibold text-[#6D9773]">
              {user.role === "ADMIN"
                ? "Administrador"
                : user.role === "BUSINESS"
                ? "Negocio"
                : "Cliente"}
            </span>
          </div>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180 text-[#0C3B2E]" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 w-64 rounded-2xl bg-white p-2 shadow-2xl border border-[#DCE7DE]
            z-50 animate-enter-scale overflow-hidden
          "
        >
          {/* Header Info */}
          <div className="rounded-xl bg-[#F8FAF8] p-3.5 mb-1 border border-gray-100">
            <p className="font-bold text-sm text-[#0C3B2E] truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">
              {user.email}
            </p>
            <div className="mt-2.5">
              <Badge
                variant={user.role === "ADMIN" ? "forest" : "sage"}
                size="sm"
                withDot
                pulseDot
              >
                {user.role === "ADMIN"
                  ? "Modo Administrador"
                  : user.role === "BUSINESS"
                  ? "Cuenta Comercial"
                  : "Usuario Verificado"}
              </Badge>
            </div>
          </div>

          <div className="py-1 space-y-0.5">
            {user.role === "ADMIN" ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0C3B2E] hover:bg-[#E8F0E9] transition"
              >
                <LayoutDashboard size={16} className="text-[#6D9773]" />
                Panel de Administración
              </Link>
            ) : (
              <Link
                href="/perfil"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0C3B2E] hover:bg-[#E8F0E9] transition"
              >
                <UserIcon size={16} className="text-[#6D9773]" />
                Mi Perfil y Vehículos
              </Link>
            )}

            <Link
              href="/servicios"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#0C3B2E] hover:bg-[#E8F0E9] transition"
            >
              <Car size={16} className="text-[#6D9773]" />
              Explorar Servicios
            </Link>
          </div>

          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}