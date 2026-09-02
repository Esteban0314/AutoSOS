"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import UserTable, { User } from "@/components/ui/UserTable";
import UserForm from "@/components/ui/UserForm";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/users");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "No se pudieron cargar los usuarios");
        }

        setUsers(data.users);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error cargando usuarios");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar permanentemente al usuario "${user.name}" (${user.email})?`
    );

    if (!confirmed) return;

    try {
      setError("");
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "No se pudo eliminar el usuario");
      }

      setUsers((current) => current.filter((u) => u.id !== user.id));
      setSuccessMessage(`Usuario "${user.name}" eliminado correctamente`);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error eliminando usuario");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.phone && u.phone.includes(searchTerm));

    return matchesRole && matchesSearch;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
      {/* NAVEGACIÓN Y TITULAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#6D9773] hover:text-[#0C3B2E] transition"
          >
            <ArrowLeft size={14} />
            Volver al Panel de Administración
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C3B2E]">
            Gestión de Usuarios
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administra cuentas registradas, permisos y roles en AutoSOS
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
          className="shadow-md"
        >
          Nuevo Usuario
        </Button>
      </div>

      {/* MENSAJES DE ALERTA */}
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200 animate-enter-scale">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-enter-scale">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* FILTROS Y BÚSQUEDA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o teléfono..."
            className="h-11 w-full rounded-xl border border-[#DCE7DE] bg-white pl-10 pr-4 text-xs text-[#0C3B2E] outline-none transition focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "CUSTOMER", "BUSINESS", "ADMIN"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                roleFilter === role
                  ? "bg-[#0C3B2E] text-white shadow-xs"
                  : "border border-[#DCE7DE] bg-white text-gray-600 hover:border-[#6D9773]"
              }`}
            >
              {role === "ALL"
                ? `Todos (${users.length})`
                : role === "CUSTOMER"
                ? `Clientes (${users.filter((u) => u.role === "CUSTOMER").length})`
                : role === "BUSINESS"
                ? `Negocios (${users.filter((u) => u.role === "BUSINESS").length})`
                : `Admins (${users.filter((u) => u.role === "ADMIN").length})`}
            </button>
          ))}
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <Card className="p-0 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Loader2 size={32} className="animate-spin text-[#6D9773] mb-3" />
            <p className="text-sm font-semibold text-[#0C3B2E]">
              Cargando usuarios...
            </p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>

      {/* MODAL CREAR / EDITAR USUARIO */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
        }}
        title={editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}
        description={
          editingUser
            ? `Modifica los datos de ${editingUser.name}`
            : "Registra un nuevo usuario o administrador en AutoSOS"
        }
      >
        <UserForm
          user={editingUser}
          onCancel={() => {
            setShowModal(false);
            setEditingUser(null);
          }}
          onSuccess={(savedUser) => {
            if (editingUser) {
              setUsers((curr) =>
                curr.map((u) => (u.id === savedUser.id ? (savedUser as User) : u))
              );
              setSuccessMessage("Usuario actualizado correctamente");
            } else {
              setUsers((curr) => [savedUser as User, ...curr]);
              setSuccessMessage("Nuevo usuario registrado con éxito");
            }
            setShowModal(false);
            setEditingUser(null);
            setTimeout(() => setSuccessMessage(""), 4000);
          }}
        />
      </Modal>
    </main>
  );
}