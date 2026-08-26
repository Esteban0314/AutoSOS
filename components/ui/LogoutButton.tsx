"use client";

import { useAuth } from "@/components/auth/AuthProvider";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({
  className = "",
}: LogoutButtonProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    window.location.href = "/";
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={className}
    >
      Cerrar sesión
    </button>
  );
}