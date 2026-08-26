"use client";

import { useState } from "react";

type User = {
  id?: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

type UserFormProps = {
  user?: User | null;
  onSuccess: (user: User) => void;
  onCancel: () => void;
};

export default function UserForm({
  user,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const isEditing = Boolean(user);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "CUSTOMER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const body: {
        name: string;
        email: string;
        password?: string;
        phone: string;
        role: string;
      } = {
        name,
        email,
        phone,
        role,
      };

      if (password) {
        body.password = password;
      }

      const response = await fetch(
        isEditing
          ? `/api/admin/users/${user?.id}`
          : "/api/admin/users",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "No se pudo guardar el usuario"
        );
      }

      onSuccess(data.user);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-[#0C3B2E] mb-2">
          Nombre
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nombre completo"
          required
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#6D9773]
            text-gray-900
            bg-white
          "
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-[#0C3B2E] mb-2">
          Correo electrónico
        </label>

        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="correo@ejemplo.com"
          required
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#6D9773]
            text-gray-900
            bg-white
          "
        />
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-semibold text-[#0C3B2E] mb-2">
          Contraseña
        </label>

        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={
            isEditing
              ? "Dejar vacío para mantener la actual"
              : "Contraseña"
          }
          required={!isEditing}
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#6D9773]
            text-gray-900
            bg-white
          "
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-[#0C3B2E] mb-2">
          Teléfono
        </label>

        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="70000000"
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#6D9773]
            text-gray-900
            bg-white
          "
        />
      </div>

      {/* Rol */}
      <div>
        <label className="block text-sm font-semibold text-[#0C3B2E] mb-2">
          Rol
        </label>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            outline-none
            focus:ring-2
            focus:ring-[#6D9773]
            text-gray-900
            bg-white
          "
        >
          <option value="CUSTOMER" className="text-gray-900 bg-white">Cliente</option>
          <option value="BUSINESS" className="text-gray-900 bg-white">Negocio</option>
          <option value="ADMIN" className="text-gray-900 bg-white">Administrador</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="
            px-5
            py-3
            rounded-lg
            font-semibold
            bg-gray-200
            text-gray-700
            hover:bg-gray-300
          "
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={loading}
          className="
            px-5
            py-3
            rounded-lg
            font-semibold
            bg-[#6D9773]
            text-white
            hover:opacity-90
            disabled:opacity-50
          "
        >
          {loading
            ? "Guardando..."
            : isEditing
              ? "Guardar cambios"
              : "Crear usuario"}
        </button>
      </div>
    </form>
  );
}