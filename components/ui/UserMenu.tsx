"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";


export default function UserMenu() {
  const { user, loading, logout } = useAuth();

  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-32 h-10 rounded-lg bg-gray-100 animate-pulse" />
    );
  }

  // Usuario no autenticado
  if (!user) {
    return (
      <Link
        href="/login"
        className="
          bg-[#6D9773]
          text-white
          px-5
          py-3
          rounded-lg
          font-semibold
          hover:opacity-90
          transition
        "
      >
        Iniciar sesión
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          items-center
          gap-3
          px-3
          py-2
          rounded-xl
          hover:bg-gray-100
          transition
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-full
            bg-[#0C3B2E]
            text-white
            flex
            items-center
            justify-center
            font-bold
          "
        >
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-[#0C3B2E]">
            {user.name}
          </p>

          <p className="text-xs text-gray-500">
            {user.role === "ADMIN"
              ? "Administrador"
              : user.role === "BUSINESS"
                ? "Negocio"
                : "Cliente"}
          </p>
        </div>

        <span className="text-gray-500">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            mt-2
            w-56
            bg-white
            rounded-xl
            shadow-lg
            border
            border-gray-100
            overflow-hidden
            z-50
          "
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-[#0C3B2E]">
              {user.name}
            </p>

            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>

          {user.role === "ADMIN" ? (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="
                block
                px-4
                py-3
                text-sm
                text-[#0C3B2E]
                hover:bg-gray-50
              "
            >
              Panel de administración
            </Link>
          ) : (
            <Link
              href="/perfil"
              onClick={() => setOpen(false)}
              className="
                block
                px-4
                py-3
                text-sm
                text-[#0C3B2E]
                hover:bg-gray-50
              "
            >
              Mi Perfil
            </Link>
          )}

          <button
            onClick={logout}
            className="
              w-full
              text-left
              px-4
              py-3
              text-sm
              text-red-600
              hover:bg-red-50
            "
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}