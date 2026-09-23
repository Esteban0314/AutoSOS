"use client";

import { useState } from "react";
import Button from "./Button";
import { Input, Select } from "./Input";
import {
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  AlertCircle,
  ShieldCheck,
  Wrench,
  Truck,
  Store,
  CheckCircle2,
  Copy,
  MapPin,
  Clock,
  Check,
} from "lucide-react";

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

const LA_PAZ_ZONES = [
  "Zona Sur - Calacoto",
  "Zona Sur - Achumani",
  "Zona Sur - Cota Cota",
  "Zona Sur - Los Pinos",
  "Zona Central",
  "Sopocachi",
  "San Pedro",
  "Miraflores",
  "Villa Fátima",
  "Obrajes",
  "El Alto",
];

const WORKSHOP_SPECIALTIES = [
  "Inyección Electrónica",
  "Frenos y Suspensión",
  "Afinación de Motor",
  "Diagnóstico por Escáner",
  "Electricidad Automotriz",
  "Aire Acondicionado",
  "Cajas y Embragues",
  "Mecánica General",
];

export default function UserForm({
  user,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const isEditing = Boolean(user);

  // Datos base
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "CUSTOMER");
  const [password, setPassword] = useState(""); // Solo para edición

  // Datos dinámicos de negocio
  const [businessName, setBusinessName] = useState("");
  const [nit, setNit] = useState("");
  const [zone, setZone] = useState(LA_PAZ_ZONES[0]);
  const [address, setAddress] = useState("");
  const [schedule, setSchedule] = useState("Lun - Sáb · 08:30 - 18:30");

  // Específicos de Taller
  const [bayCapacity, setBayCapacity] = useState("4");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    "Mecánica General",
    "Frenos y Suspensión",
  ]);

  // Específicos de Grúa
  const [towType, setTowType] = useState("Plataforma hidráulica");
  const [towCapacity, setTowCapacity] = useState("Hasta 4 Toneladas");
  const [towCoverage, setTowCoverage] = useState("Todo el Departamento de La Paz");

  // Específicos de Repuestos
  const [partsBrands, setPartsBrands] = useState("Multimarca (Toyota, Suzuki, Nissan)");
  const [hasDelivery, setHasDelivery] = useState(true);

  // Estados de carga y feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdCredentials, setCreatedCredentials] = useState<{
    user: User;
    tempPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleSpecialty = (spec: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `AutoSOS - Credenciales de acceso\nEmail: ${createdCredentials.user.email}\nContraseña temporal: ${createdCredentials.tempPassword}\nEnlace de ingreso: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const body: Record<string, any> = {
        name,
        email,
        phone,
        role,
      };

      if (isEditing && password) {
        body.password = password;
      }

      // Si es rol de negocio, adjuntar metadatos correspondientes
      if (["WORKSHOP", "TOW", "PARTS_STORE"].includes(role)) {
        body.business_name = businessName || name;
        body.nit = nit;
        body.zone = zone;
        body.address = address || `Zona ${zone}, La Paz`;
        body.schedule = schedule;

        if (role === "WORKSHOP") {
          body.bay_capacity = parseInt(bayCapacity, 10);
          body.specialties = selectedSpecialties;
        } else if (role === "TOW") {
          body.tow_type = towType;
          body.tow_capacity = towCapacity;
          body.zone = towCoverage;
        } else if (role === "PARTS_STORE") {
          body.has_delivery = hasDelivery;
          body.specialties = [partsBrands];
        }
      }

      const response = await fetch(
        isEditing ? `/api/admin/users/${user?.id}` : "/api/admin/users",
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
        throw new Error(data.message || "No se pudo procesar la solicitud");
      }

      if (!isEditing) {
        // En modo creación: Mostrar confirmación Zero-Knowledge sin revelar la contraseña
        setCreatedCredentials({
          user: data.user,
          tempPassword: "",
        });
      } else {
        onSuccess(data.user);
      }
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al procesar el usuario"
      );
    } finally {
      setLoading(false);
    }
  };

  // Si se creó el usuario exitosamente, mostrar confirmación estricta de seguridad
  if (createdCredentials) {
    return (
      <div className="space-y-5 animate-enter-scale">
        <div className="rounded-3xl bg-[#E8F0E9] border border-[#6D9773]/30 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C3B2E] text-[#FFBA00] mb-3 shadow-md">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-lg font-black text-[#0C3B2E]">
            ¡Usuario Registrado con Éxito!
          </h3>
          <p className="text-xs text-gray-600 mt-1.5 max-w-md mx-auto leading-relaxed">
            Las credenciales de acceso temporal fueron despachadas directamente a la bandeja de correo de <strong>{createdCredentials.user.email}</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE7DE] bg-white p-5 space-y-3.5 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Detalle del Registro
            </span>
            <span className="text-[10px] font-extrabold bg-[#0C3B2E] text-[#FFBA00] px-2.5 py-0.5 rounded-full">
              Rol: {createdCredentials.user.role}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Nombre registrado:</span>
              <strong className="text-[#0C3B2E]">{createdCredentials.user.name}</strong>
            </div>
            <div className="flex justify-between border-b border-gray-50 pb-2">
              <span className="text-gray-500">Correo electrónico:</span>
              <strong className="text-[#0C3B2E] font-mono">{createdCredentials.user.email}</strong>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-gray-500">Estado de contraseña:</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Auto-generada y enviada al correo
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[#F8FAF8] border border-[#DCE7DE] p-3 text-[11px] text-gray-600 flex items-start gap-2">
            <Lock size={15} className="text-[#6D9773] shrink-0 mt-0.5" />
            <p>
              <strong>Garantía de Privacidad Zero-Knowledge:</strong> Por protocolos de seguridad, el administrador <strong>no tiene acceso</strong> a la contraseña. El usuario deberá ingresar con la clave enviada a su buzón y se le solicitará cambiarla inmediatamente.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={() => onSuccess(createdCredentials.user)}
          >
            Aceptar y Volver a la Lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ALERTA DE SEGURIDAD PROTOCOLAR */}
      {!isEditing && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-[#E8F0E9]/70 border border-[#6D9773]/30 p-3.5 text-xs text-[#0C3B2E]">
          <ShieldCheck size={18} className="text-[#6D9773] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Protocolo de Seguridad AutoSOS:</strong> Para salvaguardar la privacidad, el administrador <strong>no puede asignar la contraseña</strong>. El sistema generará una clave aleatoria segura y la enviará de inmediato al correo del nuevo usuario.
          </p>
        </div>
      )}

      {/* SELECCIÓN DE ROL DE SISTEMA */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0C3B2E] mb-1.5">
          Rol en el Sistema
        </label>
        <Select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
        >
          <option value="CUSTOMER">👤 Cliente Particular (Conductor/Usuario)</option>
          <option value="ADMIN">🛡️ Administrador del Sistema</option>
          <option value="WORKSHOP">🔧 Taller Mecánico Especializado</option>
          <option value="TOW">🚛 Servicio de Grúa y Auxilio Vial</option>
          <option value="PARTS_STORE">🏪 Tienda de Repuestos y Autopartes</option>
        </Select>
      </div>

      {/* DATOS GENERALES DEL TITULAR O ENCARGADO */}
      <div className="space-y-3.5 border-t border-gray-100 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          {["WORKSHOP", "TOW", "PARTS_STORE"].includes(role)
            ? "Datos del Representante / Administrador del Negocio"
            : "Datos Personales"}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            id="name"
            label="Nombre Completo"
            icon={<UserIcon size={18} />}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Juan Pérez"
            required
          />

          <Input
            id="email"
            type="email"
            label="Correo Electrónico (Para envío de clave)"
            icon={<Mail size={18} />}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <Input
          id="phone"
          type="tel"
          label="Teléfono / Celular / WhatsApp"
          icon={<Phone size={18} />}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="Ej. +591 70000000"
        />
      </div>

      {/* EN MODO EDICIÓN: CAMPO DE CONTRASEÑA OPCIONAL */}
      {isEditing && (
        <div className="border-t border-gray-100 pt-3.5">
          <Input
            id="password"
            type="password"
            label="Cambiar Contraseña (Opcional)"
            icon={<Lock size={18} />}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Dejar vacío para conservar la actual"
            helperText="Solo llena este campo si deseas restablecer la contraseña del usuario."
          />
        </div>
      )}

      {/* CAMPOS ESPECÍFICOS SEGÚN EL ROL DE NEGOCIO */}

      {/* 1. TALLER MECÁNICO */}
      {role === "WORKSHOP" && (
        <div className="space-y-3.5 border-t border-gray-100 pt-4 rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0C3B2E]">
            <Wrench size={16} className="text-[#6D9773]" />
            <span>Ficha del Taller Mecánico en La Paz</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              id="biz-name"
              label="Nombre Comercial del Taller"
              placeholder="Ej. Taller Mecánico San Cristóbal"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Input
              id="biz-nit"
              label="NIT / Registro Comercial"
              placeholder="Ej. 1028475021"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              id="biz-zone"
              label="Zona en La Paz"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              {LA_PAZ_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </Select>

            <Input
              id="biz-address"
              label="Dirección Exacta del Taller"
              placeholder="Ej. Calle 15 de Calacoto #210"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              id="bay-cap"
              label="Capacidad de Bahías / Fosas Simultáneas"
              type="number"
              min={1}
              max={50}
              placeholder="Ej. 4 vehículos"
              value={bayCapacity}
              onChange={(e) => setBayCapacity(e.target.value)}
            />

            <Input
              id="schedule"
              label="Horario de Atención"
              placeholder="Ej. Lun - Sáb · 08:00 - 18:30"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">
              Especialidades y Servicios del Taller:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORKSHOP_SPECIALTIES.map((spec) => {
                const isChecked = selectedSpecialties.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => toggleSpecialty(spec)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold text-left transition cursor-pointer ${
                      isChecked
                        ? "bg-[#0C3B2E] text-white border-[#0C3B2E]"
                        : "bg-white text-gray-700 border-[#DCE7DE] hover:border-[#6D9773]"
                    }`}
                  >
                    <CheckCircle2
                      size={13}
                      className={isChecked ? "text-[#FFBA00]" : "text-gray-300"}
                    />
                    <span className="truncate">{spec}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICIO DE GRÚA */}
      {role === "TOW" && (
        <div className="space-y-3.5 border-t border-gray-100 pt-4 rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0C3B2E]">
            <Truck size={16} className="text-[#6D9773]" />
            <span>Ficha del Servicio de Grúa y Auxilio Vial</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              id="tow-company"
              label="Nombre de la Empresa o Servicio de Grúa"
              placeholder="Ej. Grúas La Paz 24/7 Auxilio Vial"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Select
              id="tow-type"
              label="Tipo de Grúa Principal"
              value={towType}
              onChange={(e) => setTowType(e.target.value)}
            >
              <option value="Plataforma hidráulica">Plataforma Hidráulica Basculante</option>
              <option value="Pluma / Horquilla">Pluma / Horquilla de Remolque</option>
              <option value="Arrastre pesado">Grúa de Arrastre Pesado (Camiones)</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              id="tow-cap"
              label="Capacidad Máxima de Carga / Arrastre"
              value={towCapacity}
              onChange={(e) => setTowCapacity(e.target.value)}
            >
              <option value="Hasta 3.5 Toneladas">Hasta 3.5 Toneladas (Sedanes y SUVs)</option>
              <option value="Hasta 5 Toneladas">Hasta 5 Toneladas (Camionetas y Vans)</option>
              <option value="Hasta 12 Toneladas">Hasta 12 Toneladas (Pesados / Flotas)</option>
            </Select>

            <Input
              id="tow-coverage"
              label="Zona o Cobertura de Operaciones"
              placeholder="Ej. Miraflores, Centro, Zona Sur y Autopista"
              value={towCoverage}
              onChange={(e) => setTowCoverage(e.target.value)}
            />
          </div>

          <Input
            id="tow-address"
            label="Base Operativa / Dirección en La Paz"
            placeholder="Ej. Av. Saavedra #1890, Miraflores"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
      )}

      {/* 3. TIENDA DE REPUESTOS */}
      {role === "PARTS_STORE" && (
        <div className="space-y-3.5 border-t border-gray-100 pt-4 rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0C3B2E]">
            <Store size={16} className="text-[#6D9773]" />
            <span>Ficha de la Tienda de Repuestos y Autopartes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              id="store-name"
              label="Nombre Comercial de la Tienda"
              placeholder="Ej. Autorepuestos Illimani"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <Input
              id="store-nit"
              label="NIT o Registro Comercial"
              placeholder="Ej. 1928471015"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Select
              id="store-zone"
              label="Zona de la Tienda en La Paz"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
            >
              {LA_PAZ_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </Select>

            <Input
              id="store-address"
              label="Dirección Física del Mostrador"
              placeholder="Ej. Calle Murillo #745, San Pedro"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Input
              id="store-brands"
              label="Marcas Especializadas"
              placeholder="Ej. Toyota, Suzuki, Nissan, Multimarca"
              value={partsBrands}
              onChange={(e) => setPartsBrands(e.target.value)}
            />

            <div className="flex items-center gap-2.5 pt-7">
              <input
                id="store-delivery"
                type="checkbox"
                checked={hasDelivery}
                onChange={(e) => setHasDelivery(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#0C3B2E] focus:ring-[#6D9773] cursor-pointer"
              />
              <label
                htmlFor="store-delivery"
                className="text-xs font-semibold text-gray-700 cursor-pointer"
              >
                Cuenta con servicio de Delivery en La Paz / El Alto
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? "Guardar cambios" : "Generar y Crear Usuario"}
        </Button>
      </div>
    </form>
  );
}