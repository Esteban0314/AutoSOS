"use client";

import { useState } from "react";
import Button from "./Button";
import { Input, Select } from "./Input";
import { User as UserIcon, Mail, Lock, Phone, AlertCircle } from "lucide-react";

export type User = {
  id?: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
};

export type UserFormProps = {
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
          : "Ocurrió un error al procesar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label="Nombre completo"
        icon={<UserIcon size={18} />}
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Ej. Juan Pérez"
        required
      />

      <Input
        id="email"
        type="email"
        label="Correo electrónico"
        icon={<Mail size={18} />}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="correo@ejemplo.com"
        required
      />

      <Input
        id="password"
        type="password"
        label="Contraseña"
        icon={<Lock size={18} />}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={
          isEditing
            ? "Dejar vacío para mantener la actual"
            : "••••••••"
        }
        required={!isEditing}
        helperText={
          isEditing
            ? "Solo llena este campo si deseas cambiar la contraseña del usuario."
            : "Mínimo 6 caracteres recomendados."
        }
      />

      <Input
        id="phone"
        type="tel"
        label="Teléfono / Celular"
        icon={<Phone size={18} />}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Ej. 70000000"
      />

      <Select
        id="role"
        label="Rol en el sistema"
        value={role}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value="CUSTOMER">Cliente (Conductor/Usuario)</option>
        <option value="BUSINESS">Negocio (Taller/Grúa/Repuestos)</option>
        <option value="ADMIN">Administrador del Sistema</option>
      </Select>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {isEditing ? "Guardar cambios" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}