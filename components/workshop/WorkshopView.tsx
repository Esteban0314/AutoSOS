"use client";

import { useState } from "react";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Phone,
  Send,
  Car,
  Award,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { Business } from "@/data/businesses";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";

interface WorkshopViewProps {
  business: Business;
}

export default function WorkshopView({ business }: WorkshopViewProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState("Mantenimiento Preventivo");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Mañana (08:30 - 12:00)");
  const [vehicleBrand, setVehicleBrand] = useState("Toyota");
  const [vehicleModel, setVehicleModel] = useState("Corolla / Hilux");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [ticketId, setTicketId] = useState("");

  const packages = [
    {
      id: "pkg-basic",
      title: "Mantenimiento Preventivo Básico",
      price: 180,
      duration: "1 a 2 horas",
      popular: true,
      features: [
        "Cambio de aceite y filtro nuevo",
        "Revisión de 25 puntos de seguridad",
        "Inspección de niveles y fluidos",
        "Chequeo de batería y alternador",
        "Informe digital de estado",
      ],
    },
    {
      id: "pkg-brakes",
      title: "Servicio Integral de Frenos",
      price: 260,
      duration: "2 a 3 horas",
      popular: false,
      features: [
        "Cambio de pastillas delanteras/traseras",
        "Rectificación o pulido de rotores/discos",
        "Purgado de líquido de frenos DOT4",
        "Lubricación de mordazas y guías",
        "Prueba de frenado computarizada",
      ],
    },
    {
      id: "pkg-tuneup",
      title: "Afinamiento y Rendimiento Motor",
      price: 340,
      duration: "3 a 4 horas",
      popular: false,
      features: [
        "Limpieza de inyectores por ultrasonido",
        "Cambio de bujías e inspección de bobinas",
        "Limpieza de cuerpo de aceleración",
        "Escaneo OBD-II y reseteo de testigos",
        "Ajuste de ralentí y análisis de gases",
      ],
    },
  ];

  const brandsCovered = [
    "Toyota",
    "Suzuki",
    "Nissan",
    "Hyundai",
    "Chevrolet",
    "Mitsubishi",
    "Kia",
    "Honda",
  ];

  const handleOpenBooking = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setBookingConfirmed(false);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = `SOS-TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(generatedTicket);
    setBookingConfirmed(true);
  };

  const handleSendToWhatsApp = () => {
    let message = `*¡Hola ${business.name}!* 👋\n`;
    message += `Quisiera confirmar mi *Reserva de Turno* en el taller mediante *AutoSOS Bolivia*:\n\n`;
    message += `🎟️ *N° de Ticket:* ${ticketId}\n`;
    message += `🛠️ *Servicio:* ${selectedService}\n`;
    message += `📅 *Fecha:* ${date || "Lo antes posible"}\n`;
    message += `⏰ *Turno:* ${timeSlot}\n`;
    message += `🚗 *Vehículo:* ${vehicleBrand} ${vehicleModel} ${
      vehiclePlate ? `(Placa: ${vehiclePlate})` : ""
    }\n`;
    if (clientName) message += `👤 *Cliente:* ${clientName}\n`;
    if (clientPhone) message += `📞 *Teléfono:* ${clientPhone}\n`;
    message += `\n¿Me confirman la recepción del turno? ¡Muchas gracias!`;

    const cleanPhone = business.phone.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-8">
      {/* BANNER PRINCIPAL DE SERVICIOS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-[#0C3B2E] text-white p-6 shadow-lg border border-[#145341]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="sm" withDot pulseDot>
              Taller Verificado
            </Badge>
            <span className="text-xs text-gray-300">Turnos Disponibles Hoy</span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-white">
            Servicios y Mantenimiento Mecánico
          </h2>
          <p className="text-xs text-gray-300 mt-0.5">
            Mecánicos calificados, herramientas de diagnóstico de última generación y repuestos garantizados
          </p>
        </div>

        <Button
          variant="yellow"
          size="lg"
          icon={<Calendar size={18} />}
          onClick={() => handleOpenBooking()}
          className="font-extrabold shadow-md shrink-0"
        >
          Agendar Cita en Taller
        </Button>
      </div>

      {/* PAQUETES DE MANTENIMIENTO CON PRECIOS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0C3B2E]">
              Paquetes de Mantenimiento con Tarifa Cerrada
            </h3>
            <p className="text-xs text-gray-500">
              Precios transparentes que incluyen mano de obra e insumos principales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              hoverEffect
              className={`flex flex-col justify-between p-6 ${
                pkg.popular
                  ? "border-[#6D9773] bg-gradient-to-b from-[#E8F0E9]/40 to-white shadow-md"
                  : "border-[#DCE7DE] bg-white"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                    <Clock size={13} className="text-[#6D9773]" />
                    {pkg.duration}
                  </span>
                  {pkg.popular && (
                    <span className="rounded-full bg-[#FFBA00] px-2.5 py-0.5 text-[10px] font-extrabold text-[#0C3B2E]">
                      Más Solicitado
                    </span>
                  )}
                </div>

                <h4 className="text-base font-extrabold text-[#0C3B2E] mt-1">
                  {pkg.title}
                </h4>

                <div className="mt-3 mb-5">
                  <span className="text-2xl font-extrabold text-[#0C3B2E]">
                    {pkg.price} Bs
                  </span>
                  <span className="text-xs text-gray-400 ml-1">estimado</span>
                </div>

                <ul className="space-y-2.5 border-t border-gray-100 pt-4 text-xs text-gray-600">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-[#6D9773] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant={pkg.popular ? "yellow" : "outline"}
                  fullWidth
                  size="sm"
                  onClick={() => handleOpenBooking(pkg.title)}
                  className="font-bold text-xs"
                >
                  Reservar este paquete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* MARCAS ATENDIDAS & GARANTÍA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
              <Car size={20} className="text-[#6D9773]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0C3B2E]">
                Marcas con Escaneo y Cobertura Oficial
              </h4>
              <p className="text-xs text-gray-500">
                Especialización en vehículos del parque automotor boliviano
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {brandsCovered.map((brand, i) => (
              <span
                key={i}
                className="rounded-xl bg-[#F8FAF8] px-3 py-1.5 text-xs font-bold text-[#0C3B2E] border border-[#DCE7DE]"
              >
                {brand}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
              <Award size={20} className="text-[#6D9773]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#0C3B2E]">
                Compromiso de Calidad AutoSOS
              </h4>
              <p className="text-xs text-gray-500">
                Transparencia total en presupuesto y repuestos
              </p>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#6D9773]" />
              <span>Garantía escrita de 3 meses en reparaciones de motor y frenos</span>
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#6D9773]" />
              <span>Sin costos sorpresa: aprobación previa antes de cualquier cambio de pieza</span>
            </li>
          </ul>
        </Card>
      </div>

      {/* MODAL AGENDAR CITA */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title={bookingConfirmed ? "¡Cita Confirmada!" : `Agendar Turno en ${business.name}`}
        description={
          bookingConfirmed
            ? "Tu reserva fue registrada con éxito en el sistema de turnos del taller."
            : "Selecciona el servicio y horario deseado para recibir atención prioritaria."
        }
      >
        {bookingConfirmed ? (
          <div className="space-y-5 text-center py-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
              <FileCheck size={36} />
            </div>

            <div className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE] text-left text-xs space-y-2">
              <div className="flex justify-between font-mono font-bold text-[#0C3B2E]">
                <span>N° DE TICKET:</span>
                <span className="text-[#6D9773]">{ticketId}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Servicio:</span>
                <span className="font-semibold text-[#0C3B2E]">{selectedService}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Turno:</span>
                <span className="font-semibold text-[#0C3B2E]">{timeSlot}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Vehículo:</span>
                <span className="font-semibold text-[#0C3B2E]">
                  {vehicleBrand} {vehicleModel}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="yellow"
                fullWidth
                size="md"
                icon={<Send size={15} />}
                onClick={handleSendToWhatsApp}
                className="font-extrabold shadow-md"
              >
                Enviar confirmación a WhatsApp
              </Button>

              <Button
                variant="outline"
                fullWidth
                size="sm"
                onClick={() => setShowBookingModal(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div>
              <Select
                id="booking-service"
                label="Servicio requerido"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
              >
                <option value="Mantenimiento Preventivo Básico">Mantenimiento Preventivo Básico (180 Bs)</option>
                <option value="Servicio Integral de Frenos">Servicio Integral de Frenos (260 Bs)</option>
                <option value="Afinamiento y Rendimiento Motor">Afinamiento y Rendimiento Motor (340 Bs)</option>
                <option value="Diagnóstico Computarizado OBD-II">Diagnóstico Computarizado OBD-II (120 Bs)</option>
                <option value="Suspensión y Dirección">Revisión de Suspensión y Dirección</option>
                <option value="Otro Servicio / Diagnóstico General">Otro Servicio / Consulta General</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="booking-date"
                label="Fecha estimada"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <Select
                id="booking-timeslot"
                label="Turno preferido"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="Mañana (08:30 - 12:00)">Mañana (08:30 - 12:00)</option>
                <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                <option value="Cualquier horario disponible">Cualquier horario disponible</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="booking-brand"
                label="Marca y Modelo del auto"
                placeholder="Ej. Toyota Corolla"
                value={`${vehicleBrand} ${vehicleModel}`}
                onChange={(e) => {
                  setVehicleBrand(e.target.value);
                  setVehicleModel("");
                }}
                required
              />

              <Input
                id="booking-plate"
                label="Placa de control (Opcional)"
                placeholder="Ej. 4231-PLK"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="booking-name"
                label="Tu Nombre"
                placeholder="Ej. Rodrigo Fernández"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />

              <Input
                id="booking-phone"
                label="Teléfono / Celular"
                placeholder="Ej. 70123456"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => setShowBookingModal(false)}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="yellow"
                fullWidth
                className="font-extrabold"
              >
                Confirmar Turno
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
