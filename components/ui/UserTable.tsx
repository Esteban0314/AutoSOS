"use client";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

type UserTableProps = {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
};

export default function UserTable({
  users,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="px-4 py-4 text-sm font-semibold text-[#0C3B2E]">
              Nombre
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-[#0C3B2E]">
              Email
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-[#0C3B2E]">
              Teléfono
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-[#0C3B2E]">
              Rol
            </th>

            <th className="px-4 py-4 text-sm font-semibold text-[#0C3B2E]">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-4 font-medium text-gray-800">
                {user.name}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {user.email}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {user.phone || "—"}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`
                    inline-flex
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      user.role === "ADMIN"
                        ? "bg-[#0C3B2E] text-white"
                        : "bg-[#6D9773] text-white"
                    }
                  `}
                >
                  {user.role}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-[#6D9773]
                      text-white
                      text-sm
                      font-semibold
                      hover:opacity-90
                    "
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => onDelete(user)}
                    className="
                      px-3
                      py-2
                      rounded-lg
                      bg-gray-200
                      text-gray-700
                      text-sm
                      font-semibold
                      hover:bg-gray-300
                    "
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No hay usuarios registrados.
        </div>
      )}
    </div>
  );
}