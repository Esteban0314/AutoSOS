"use client";

import { Edit3, Trash2, Mail, Phone, User as UserIcon } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at?: string;
};

export type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#E8F0E9] text-[#0C3B2E] mb-3">
          <UserIcon size={30} className="text-[#6D9773]" />
        </div>
        <p className="text-base font-bold text-[#0C3B2E]">No hay usuarios registrados</p>
        <p className="text-xs text-gray-400 mt-1 max-w-sm">
          No se encontraron registros con los filtros actuales o la base de datos está vacía.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#DCE7DE] bg-[#F8FAF8]/80 text-xs font-bold uppercase tracking-wider text-[#0C3B2E]">
            <th className="px-6 py-4">Usuario</th>
            <th className="px-6 py-4">Contacto</th>
            <th className="px-6 py-4">Rol en Sistema</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {users.map((user) => {
            const roleBadge =
              user.role === "ADMIN"
                ? { variant: "forest" as const, label: "Administrador" }
                : user.role === "WORKSHOP"
                ? { variant: "amber" as const, label: "Taller Mecánico" }
                : user.role === "TOW"
                ? { variant: "amber" as const, label: "Servicio de Grúa" }
                : user.role === "PARTS_STORE"
                ? { variant: "amber" as const, label: "Tienda de Repuestos" }
                : user.role === "BUSINESS"
                ? { variant: "amber" as const, label: "Negocio General" }
                : { variant: "sage" as const, label: "Cliente" };

            return (
              <tr
                key={user.id}
                className="transition-colors hover:bg-[#F8FAF8]/70 group"
              >
                {/* Nombre y Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C3B2E] text-white font-bold text-sm shadow-xs border border-[#145341]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0C3B2E] group-hover:text-[#6D9773] transition-colors">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400">ID: #{user.id}</p>
                    </div>
                  </div>
                </td>

                {/* Contacto */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <Mail size={13} className="text-gray-400" />
                      {user.email}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Phone size={13} className="text-gray-400" />
                      {user.phone || "Sin teléfono"}
                    </p>
                  </div>
                </td>

                {/* Rol */}
                <td className="px-6 py-4">
                  <Badge variant={roleBadge.variant} size="sm" withDot>
                    {roleBadge.label}
                  </Badge>
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit3 size={14} />}
                      onClick={() => onEdit(user)}
                      className="hover:border-[#6D9773]"
                    >
                      Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<Trash2 size={14} className="text-red-500" />}
                      onClick={() => onDelete(user)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}