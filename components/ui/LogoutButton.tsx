"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
  showIcon?: boolean;
};

export default function LogoutButton({
  className = "",
  showIcon = false,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`inline-flex items-center gap-2 cursor-pointer transition ${className}`}
    >
      {showIcon && <LogOut size={16} />}
      <span>Cerrar sesión</span>
    </button>
  );
}