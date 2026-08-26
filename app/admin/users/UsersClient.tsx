"use client";

import { useEffect, useState } from "react";
import UserTable from "@/components/ui/UserTable";
import UserForm from "@/components/ui/UserForm";

type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
};

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "No se pudieron cargar los usuarios"
          );
        }

        setUsers(data.users);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Error cargando usuarios"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
  setEditingUser(user);
  setShowForm(true);
};

  const handleDelete = async (user: User) => {
  const confirmed = window.confirm(
    `¿Estás seguro de eliminar al usuario "${user.name}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setError("");

    const response = await fetch(
      `/api/admin/users/${user.id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "No se pudo eliminar el usuario"
      );
    }

    setUsers((currentUsers) =>
      currentUsers.filter(
        (currentUser) => currentUser.id !== user.id
      )
    );
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Error eliminando usuario"
    );
  }
};

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-[#0C3B2E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <h1 className="text-2xl font-bold">
            AutoSOS
          </h1>

          <p className="text-sm text-gray-200">
            Gestión de usuarios
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#0C3B2E]">
              Usuarios
            </h2>

            <p className="text-gray-500 mt-2">
              Administra los usuarios registrados en AutoSOS.
            </p>
          </div>

          <button
                onClick={() => {
                    setEditingUser(null);
                    setShowForm(true);
                }}
                className="
                    bg-[#6D9773]
                    text-white
                    px-5
                    py-3
                    rounded-lg
                    font-semibold
                    hover:opacity-90
                "
                >
                + Nuevo usuario
            </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}
        {showForm && (
            <div className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-[#0C3B2E] mb-6">
                {editingUser
                    ? "Editar usuario"
                    : "Nuevo usuario"}
                </h3>

                <UserForm
                user={editingUser}
                onCancel={() => {
                    setShowForm(false);
                    setEditingUser(null);
                }}
                onSuccess={(savedUser) => {
                    if (editingUser) {
                    setUsers((currentUsers) =>
                        currentUsers.map((currentUser) =>
                        currentUser.id === savedUser.id
                            ? savedUser
                            : currentUser
                        )
                    );
                    } else {
                    setUsers((currentUsers) => [
                        savedUser,
                        ...currentUsers,
                    ]);
                    }

                    setShowForm(false);
                    setEditingUser(null);
                }}
                />
            </div>
            )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Cargando usuarios...
            </div>
          ) : (
            <UserTable
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </section>
    </main>
  );
}