"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Car,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Gauge,
  Fuel,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";

export type Vehicle = {
  id: number;
  user_id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  type: string;
  fuel_type: string | null;
  transmission: string | null;
  mileage: number | null;
  created_at: string;
};

export default function VehiclesManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("2020");
  const [color, setColor] = useState("Blanco");
  const [type, setType] = useState("Sedán");
  const [fuelType, setFuelType] = useState("Gasolina");
  const [transmission, setTransmission] = useState("Manual");
  const [mileage, setMileage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles");
        const data = await response.json();
        if (!ignore) {
          if (response.ok && data.success) {
            setVehicles(data.vehicles || []);
          } else {
            setError(data.message || "Error al cargar los vehículos");
          }
          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error al consultar los vehículos");
          setLoading(false);
        }
      }
    }

    fetchVehicles();

    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setPlate("");
    setBrand("");
    setModel("");
    setYear("2020");
    setColor("Blanco");
    setType("Sedán");
    setFuelType("Gasolina");
    setTransmission("Manual");
    setMileage("");
    setShowModal(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setPlate(v.plate);
    setBrand(v.brand);
    setModel(v.model);
    setYear(v.year.toString());
    setColor(v.color);
    setType(v.type);
    setFuelType(v.fuel_type || "Gasolina");
    setTransmission(v.transmission || "Manual");
    setMileage(v.mileage ? v.mileage.toString() : "");
    setShowModal(true);
  };

  const handleDelete = async (v: Vehicle) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el vehículo ${v.brand} ${v.model} (${v.plate}) de tu garage?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/vehicles/${v.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setVehicles((curr) => curr.filter((item) => item.id !== v.id));
        setSuccessMessage(`Vehículo ${v.plate} eliminado de tu garage`);
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        alert(data.message || "No se pudo eliminar el vehículo");
      }
    } catch (err) {
      console.error(err);
      alert("Error al intentar eliminar el vehículo");
    }
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : "/api/vehicles";
      const method = editingVehicle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate,
          brand,
          model,
          year: parseInt(year, 10),
          color,
          type,
          fuel_type: fuelType,
          transmission,
          mileage: mileage ? parseInt(mileage, 10) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al procesar el vehículo");
      }

      if (editingVehicle) {
        setVehicles((curr) =>
          curr.map((v) => (v.id === editingVehicle.id ? (data.vehicle as Vehicle) : v))
        );
        setSuccessMessage("Vehículo actualizado correctamente");
      } else {
        setVehicles((curr) => [data.vehicle as Vehicle, ...curr]);
        setSuccessMessage("¡Vehículo agregado a tu garage con éxito!");
      }

      setShowModal(false);
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al guardar el vehículo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#0C3B2E]">
            <Car size={22} className="text-[#6D9773]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#0C3B2E]">Mi Garage de Vehículos</h2>
              <span className="rounded-full bg-[#E8F0E9] px-2.5 py-0.5 text-xs font-extrabold text-[#6D9773]">
                {vehicles.length} {vehicles.length === 1 ? "Auto" : "Autos"}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Administra los datos de tus vehículos para diagnósticos exactos y auxilio vial
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={handleOpenAdd}
        >
          Agregar vehículo
        </Button>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {successMessage && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 border border-emerald-200 animate-enter-scale">
          <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* LISTADO DE VEHÍCULOS */}
      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 size={28} className="animate-spin text-[#6D9773] mb-2" />
            <p className="text-xs text-gray-500">Cargando tus vehículos...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-[#DCE7DE] bg-[#F8FAF8]/60 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F0E9] text-[#0C3B2E] mb-3 shadow-xs">
              <Car size={28} className="text-[#6D9773]" />
            </div>
            <h3 className="text-base font-bold text-[#0C3B2E]">
              Aún no tienes vehículos en tu garage
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Registra tu auto para solicitar diagnósticos con IA, cotizar repuestos exactos y agendar citas en talleres mecánicos.
            </p>
            <Button
              variant="yellow"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleOpenAdd}
              className="mt-4 font-bold"
            >
              Registrar mi primer auto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="relative rounded-3xl border border-[#DCE7DE] bg-gradient-to-b from-white to-[#F8FAF8] p-5 shadow-xs hover:border-[#6D9773] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#0C3B2E] px-2.5 py-0.5 text-xs font-extrabold tracking-wider text-[#FFBA00] shadow-xs">
                          {veh.plate}
                        </span>
                        <span className="text-xs text-gray-400 font-semibold">{veh.type}</span>
                      </div>

                      <h3 className="mt-2 text-lg font-extrabold text-[#0C3B2E]">
                        {veh.brand} {veh.model}
                      </h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Año {veh.year} • Color {veh.color}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(veh)}
                        className="rounded-xl p-2 text-gray-400 hover:text-[#0C3B2E] hover:bg-gray-100 transition cursor-pointer"
                        title="Editar vehículo"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(veh)}
                        className="rounded-xl p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Eliminar vehículo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Chips de especificaciones */}
                  <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1 rounded-lg bg-[#E8F0E9] px-2.5 py-1 text-[#0C3B2E]">
                      <Fuel size={12} className="text-[#6D9773]" />
                      {veh.fuel_type || "Gasolina"}
                    </span>
                    <span className="rounded-lg bg-[#E8F0E9] px-2.5 py-1 text-[#0C3B2E]">
                      {veh.transmission || "Manual"}
                    </span>
                    {veh.mileage && (
                      <span className="flex items-center gap-1 rounded-lg bg-gray-100 px-2.5 py-1 text-gray-700">
                        <Gauge size={12} className="text-gray-500" />
                        {veh.mileage.toLocaleString()} km
                      </span>
                    )}
                  </div>
                </div>

                {/* Acción rápida de diagnóstico */}
                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                  <Link href="/diagnostico" className="w-full">
                    <Button
                      variant="outline"
                      fullWidth
                      size="sm"
                      icon={<Sparkles size={14} className="text-[#FFBA00]" />}
                      className="text-xs font-bold border-[#DCE7DE] hover:border-[#6D9773]"
                    >
                      Diagnosticar con IA
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL REGISTRAR / EDITAR VEHÍCULO */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingVehicle ? "Editar Vehículo" : "Agregar Nuevo Vehículo"}
        description={
          editingVehicle
            ? `Modifica los datos de tu ${editingVehicle.brand} ${editingVehicle.model}`
            : "Registra la placa, marca y modelo para personalizar tu asistencia"
        }
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="veh-plate"
              label="Placa de Control"
              placeholder="Ej. 4589-KTL"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
            />

            <Input
              id="veh-brand"
              label="Marca del Fabricante"
              placeholder="Ej. Toyota, Suzuki, Nissan"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="veh-model"
              label="Modelo"
              placeholder="Ej. Hilux, Corolla, Swift"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
            />

            <Input
              id="veh-year"
              label="Año de Fabricación"
              type="number"
              placeholder="Ej. 2021"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              id="veh-color"
              label="Color Exterior"
              placeholder="Ej. Blanco, Plateado"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />

            <Select
              id="veh-type"
              label="Tipo de Carrocería"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Sedán">Sedán</option>
              <option value="SUV">SUV / Camioneta</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Pickup">Pickup</option>
              <option value="Miniván">Miniván</option>
              <option value="Motocicleta">Motocicleta</option>
            </Select>

            <Select
              id="veh-fuel"
              label="Combustible"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
            >
              <option value="Gasolina">Gasolina</option>
              <option value="Diésel">Diésel</option>
              <option value="GNV">GNV / Gas</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Eléctrico">Eléctrico</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="veh-trans"
              label="Transmisión"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="Manual">Manual / Mecánica</option>
              <option value="Automática">Automática / Secuencial</option>
              <option value="CVT">CVT</option>
            </Select>

            <Input
              id="veh-mileage"
              label="Kilometraje Actual (km)"
              type="number"
              placeholder="Ej. 45000"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={saving}
            >
              {editingVehicle ? "Guardar cambios" : "Registrar vehículo"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
