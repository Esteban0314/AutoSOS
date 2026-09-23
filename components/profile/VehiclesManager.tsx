"use client";

import { useEffect, useState, useRef } from "react";
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
  Upload,
  X,
  ShieldCheck,
  Camera,
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
  image_url?: string | null;
  created_at: string;
};

// Marcas y modelos comunes en Bolivia
const POPULAR_BRANDS: Record<string, string[]> = {
  Toyota: ["Hilux", "Corolla", "Land Cruiser", "RAV4", "Yaris", "Prado", "Etios", "Fortuner", "4Runner"],
  Suzuki: ["Swift", "Jimny", "Grand Vitara", "Alto", "Celerio", "S-Presso", "Baleno", "Vitara"],
  Nissan: ["Patrol", "Frontier", "Kicks", "Versa", "X-Trail", "March", "Sentra", "Pathfinder"],
  Hyundai: ["Tucson", "Creta", "Grand i10", "Santa Fe", "Accent", "Elantra", "Kona"],
  Kia: ["Sportage", "Seltos", "Picanto", "Rio", "Sorento", "Soluto"],
  Mitsubishi: ["Montero", "L200", "Outlander", "ASX", "Pajero"],
  Chevrolet: ["D-Max", "Tracker", "Onix", "Cruze", "Captiva", "Sail"],
  Ford: ["Ranger", "Explorer", "F-150", "EcoSport", "Escape"],
  Volkswagen: ["Gol", "Tiguan", "Amarok", "Polo", "T-Cross"],
  Honda: ["CR-V", "Civic", "HR-V", "Pilot", "Fit"],
  BYD: ["Tang", "Song Plus", "Yuan Plus", "Dolphin", "Han"],
  Otra: [],
};

// Función para validar formato de placa boliviana (3 o 4 números + 3 letras)
export function validateBolivianPlate(plate: string) {
  const cleaned = plate.toUpperCase().trim();
  const regex = /^[1-9][0-9]{2,3}-[A-Z]{3}$/;
  return regex.test(cleaned);
}

// Función para auto-formatear placa
export function formatBolivianPlate(input: string) {
  let val = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (val.length > 7) {
    val = val.slice(0, 7);
  }

  // Si tiene al menos 4 caracteres y los primeros son números
  const numbersMatch = val.match(/^([0-9]{3,4})/);
  if (numbersMatch) {
    const numPart = numbersMatch[1];
    const letterPart = val.slice(numPart.length);
    if (letterPart.length > 0) {
      return `${numPart}-${letterPart}`;
    }
    return numPart;
  }
  return val;
}

export default function VehiclesManager() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form states
  const [plate, setPlate] = useState("");
  const [brand, setBrand] = useState("Toyota");
  const [customBrand, setCustomBrand] = useState("");
  const [model, setModel] = useState("Hilux");
  const [customModel, setCustomModel] = useState("");
  const [year, setYear] = useState("2021");
  const [color, setColor] = useState("Blanco");
  const [type, setType] = useState("SUV");
  const [fuelType, setFuelType] = useState("Gasolina");
  const [transmission, setTransmission] = useState("Manual");
  const [mileage, setMileage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setBrand("Toyota");
    setCustomBrand("");
    setModel("Hilux");
    setCustomModel("");
    setYear("2021");
    setColor("Blanco");
    setType("SUV");
    setFuelType("Gasolina");
    setTransmission("Manual");
    setMileage("");
    setImageUrl(null);
    setError("");
    setShowModal(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setPlate(v.plate);
    
    // Configurar marca y modelo
    if (Object.keys(POPULAR_BRANDS).includes(v.brand)) {
      setBrand(v.brand);
      setCustomBrand("");
      if (POPULAR_BRANDS[v.brand].includes(v.model)) {
        setModel(v.model);
        setCustomModel("");
      } else {
        setModel("Otro");
        setCustomModel(v.model);
      }
    } else {
      setBrand("Otra");
      setCustomBrand(v.brand);
      setModel("Otro");
      setCustomModel(v.model);
    }

    setYear(v.year.toString());
    setColor(v.color);
    setType(v.type);
    setFuelType(v.fuel_type || "Gasolina");
    setTransmission(v.transmission || "Manual");
    setMileage(v.mileage ? v.mileage.toString() : "");
    setImageUrl(v.image_url || null);
    setError("");
    setShowModal(true);
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBolivianPlate(e.target.value);
    setPlate(formatted);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Error al subir la imagen");
      }

      setImageUrl(data.url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploadingImage(false);
    }
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

    // Validar placa RUAT
    if (!validateBolivianPlate(plate)) {
      setError("La placa debe cumplir con el formato oficial boliviano RUAT: 3 o 4 números seguidos de 3 letras (ej. 4589-KTL o 982-ABC)");
      setSaving(false);
      return;
    }

    const finalBrand = brand === "Otra" ? customBrand.trim() : brand;
    const finalModel = model === "Otro" ? customModel.trim() : model;

    if (!finalBrand || !finalModel) {
      setError("Debes indicar la marca y el modelo del vehículo");
      setSaving(false);
      return;
    }

    const currentYear = new Date().getFullYear();
    const numYear = parseInt(year, 10);
    if (isNaN(numYear) || numYear < 1970 || numYear > currentYear + 1) {
      setError(`El año debe encontrarse entre 1970 y ${currentYear + 1}`);
      setSaving(false);
      return;
    }

    try {
      const url = editingVehicle ? `/api/vehicles/${editingVehicle.id}` : "/api/vehicles";
      const method = editingVehicle ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate,
          brand: finalBrand,
          model: finalModel,
          year: numYear,
          color,
          type,
          fuel_type: fuelType,
          transmission,
          mileage: mileage ? parseInt(mileage, 10) : null,
          image_url: imageUrl,
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

  const isPlateValid = validateBolivianPlate(plate);
  const availableModels = POPULAR_BRANDS[brand] || [];

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
              Administra tus vehículos registrados con placa boliviana RUAT y fotografía
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
              Registra tu auto con su placa boliviana para solicitar diagnósticos con IA, cotizar repuestos exactos y agendar citas en talleres mecánicos.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className="relative overflow-hidden rounded-3xl border border-[#DCE7DE] bg-white shadow-xs hover:border-[#6D9773] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                {/* FOTO DEL VEHÍCULO O BANNER ILUSTRATIVO */}
                <div className="relative h-44 w-full bg-gradient-to-br from-[#0C3B2E] to-[#145341] overflow-hidden flex items-center justify-center">
                  {veh.image_url ? (
                    <img
                      src={veh.image_url}
                      alt={`${veh.brand} ${veh.model}`}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/70">
                      <Car size={48} className="text-[#FFBA00] mb-2" />
                      <span className="text-xs font-semibold tracking-wider uppercase text-emerald-200">
                        {veh.type}
                      </span>
                    </div>
                  )}

                  {/* BADGE DE PLACA RUAT ESTILO BOLIVIA */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-xl bg-black/75 px-3 py-1 text-xs font-black tracking-widest text-[#FFBA00] shadow-lg backdrop-blur-md border border-white/20">
                    <span className="text-[10px] text-gray-300 font-extrabold mr-0.5">BOLIVIA</span>
                    <span>{veh.plate}</span>
                  </div>

                  {/* ACCIONES TOP */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/10">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(veh)}
                      className="rounded-lg p-1.5 text-white hover:text-[#FFBA00] hover:bg-white/20 transition cursor-pointer"
                      title="Editar vehículo"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(veh)}
                      className="rounded-lg p-1.5 text-white hover:text-red-400 hover:bg-white/20 transition cursor-pointer"
                      title="Eliminar vehículo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* CONTENIDO DE DETALLES */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-[#0C3B2E]">
                        {veh.brand} {veh.model}
                      </h3>
                      <span className="text-xs font-bold text-gray-400">
                        {veh.year}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Carrocería: {veh.type} • Color: {veh.color}
                    </p>

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

                  {/* Botón de Diagnóstico */}
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <Link href="/diagnostico" className="block w-full">
                      <Button
                        variant="outline"
                        fullWidth
                        size="sm"
                        icon={<Sparkles size={14} className="text-[#FFBA00]" />}
                        className="text-xs font-bold border-[#DCE7DE] hover:border-[#6D9773]"
                      >
                        Diagnosticar con IA este vehículo
                      </Button>
                    </Link>
                  </div>
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
            : "Registra tu automóvil con matrícula boliviana oficial y foto para soporte vial exacto"
        }
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* SUBIDA DE FOTO DEL VEHÍCULO */}
          <div className="border border-dashed border-[#DCE7DE] rounded-2xl p-4 bg-[#F8FAF8] text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {imageUrl ? (
              <div className="relative mx-auto h-36 w-full max-w-xs rounded-xl overflow-hidden shadow-sm group">
                <img
                  src={imageUrl}
                  alt="Vista previa del auto"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 bg-white/90 rounded-lg text-xs font-bold text-[#0C3B2E] hover:bg-white transition"
                  >
                    Cambiar foto
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F0E9] text-[#6D9773] mb-2">
                  {uploadingImage ? (
                    <Loader2 size={22} className="animate-spin text-[#6D9773]" />
                  ) : (
                    <Camera size={22} />
                  )}
                </div>
                <p className="text-xs font-bold text-[#0C3B2E]">Fotografía del Vehículo</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Sube una foto de tu auto para reconocerlo fácilmente (JPG, PNG hasta 5MB)
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-[#DCE7DE] bg-white px-3 py-1.5 text-xs font-bold text-[#0C3B2E] hover:border-[#6D9773] transition cursor-pointer shadow-xs"
                >
                  <Upload size={13} />
                  <span>{uploadingImage ? "Subiendo..." : "Seleccionar imagen"}</span>
                </button>
              </div>
            )}
          </div>

          {/* PLACA RUAT CON RESTRICCIÓN Y VALIDACIÓN */}
          <div>
            <Input
              id="veh-plate"
              label="Placa de Control Oficial (Bolivia RUAT)"
              placeholder="Ej. 4589-KTL o 982-ABC"
              value={plate}
              onChange={handlePlateChange}
              required
            />
            {plate && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold">
                {isPlateValid ? (
                  <span className="flex items-center gap-1 text-emerald-700">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Formato oficial RUAT Bolivia válido
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-700">
                    <AlertCircle size={14} className="text-amber-600" />
                    Formato incompleto: debe tener 3 o 4 números y 3 letras (ej. 4589-KTL)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* MARCA Y MODELO ASISTIDOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Select
                id="veh-brand-select"
                label="Marca del Fabricante"
                value={brand}
                onChange={(e) => {
                  const newBrand = e.target.value;
                  setBrand(newBrand);
                  if (newBrand !== "Otra" && POPULAR_BRANDS[newBrand]?.length > 0) {
                    setModel(POPULAR_BRANDS[newBrand][0]);
                  } else {
                    setModel("Otro");
                  }
                }}
              >
                {Object.keys(POPULAR_BRANDS).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </Select>
              {brand === "Otra" && (
                <div className="mt-2">
                  <Input
                    id="veh-brand-custom"
                    placeholder="Escribe la marca del auto"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            <div>
              {brand !== "Otra" && availableModels.length > 0 ? (
                <>
                  <Select
                    id="veh-model-select"
                    label="Modelo"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  >
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="Otro">Otro modelo...</option>
                  </Select>
                  {model === "Otro" && (
                    <div className="mt-2">
                      <Input
                        id="veh-model-custom"
                        placeholder="Escribe el modelo exacto"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
              ) : (
                <Input
                  id="veh-model-free"
                  label="Modelo del Vehículo"
                  placeholder="Ej. Hilux, Corolla, Swift"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  required
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="veh-year"
              label="Año de Fabricación (1970 - 2027)"
              type="number"
              min={1970}
              max={new Date().getFullYear() + 1}
              placeholder="Ej. 2021"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />

            <Input
              id="veh-color"
              label="Color Exterior"
              placeholder="Ej. Blanco, Plateado, Rojo"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              id="veh-type"
              label="Tipo de Carrocería"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="SUV">SUV / Camioneta</option>
              <option value="Sedán">Sedán</option>
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

            <Select
              id="veh-trans"
              label="Transmisión"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="Manual">Manual / Mecánica</option>
              <option value="Automática">Automática</option>
              <option value="CVT">CVT</option>
            </Select>
          </div>

          <div>
            <Input
              id="veh-mileage"
              label="Kilometraje Actual (km)"
              type="number"
              min={0}
              max={1000000}
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
              disabled={saving || !isPlateValid}
            >
              {editingVehicle ? "Guardar cambios" : "Registrar vehículo"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
