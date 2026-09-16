"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Brain,
  Truck,
  Download,
  Printer,
  Calendar,
  ArrowLeft,
  Clock,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import StatCard from "@/components/ui/StatCard";

interface ReportesClientProps {
  adminUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// Helper para exportación CSV (aislado de render)
function downloadMetricsReport(
  adminName: string,
  adminEmail: string,
  timeframe: string,
  metrics: {
    totalUsers: number;
    newUsers: number;
    towRequests: number;
    aiDiagnoses: number;
    avgResponseTime: string;
    conversionRate: string;
  },
  diagnosisCategories: { name: string; count: number; percentage: number }[],
  userDistribution: { role: string; count: number; pct: string }[]
) {
  const dateStr = new Date().toISOString().slice(0, 10);
  const csvRows = [
    ["REPORTE EJECUTIVO DE METRICAS - AUTOSOS BOLIVIA"],
    [`Generado por: ${adminName} (${adminEmail})`],
    [`Fecha: ${dateStr}`],
    [`Rango temporal: ${timeframe}`],
    [],
    ["METRICA", "VALOR"],
    ["Total Usuarios Registrados", metrics.totalUsers],
    ["Nuevos Registros en Periodo", metrics.newUsers],
    ["Solicitudes de Auxilio y Grua", metrics.towRequests],
    ["Diagnosticos IA Ejecutados", metrics.aiDiagnoses],
    ["Tiempo Promedio de Respuesta", metrics.avgResponseTime],
    ["Tasa de Conversion / Atencion", metrics.conversionRate],
    [],
    ["FALLAS DIAGNOSTICADAS POR IA", "CONSULTAS", "PORCENTAJE"],
    ...diagnosisCategories.map((c) => [c.name, c.count, `${c.percentage}%`]),
    [],
    ["DISTRIBUCION DE USUARIOS", "CANTIDAD", "PORCENTAJE"],
    ...userDistribution.map((u) => [u.role, u.count, u.pct]),
  ];

  const csvContent =
    "data:text/csv;charset=utf-8," +
    csvRows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `AutoSOS_Reporte_${timeframe}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ReportesClient({ adminUser }: ReportesClientProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "year" | "all">("30d");

  // Métricas dinámicas según el rango seleccionado
  const metrics = {
    "7d": {
      totalUsers: 142,
      newUsers: 18,
      towRequests: 24,
      aiDiagnoses: 68,
      avgResponseTime: "11 min",
      conversionRate: "94.2%",
      dailyData: [
        { label: "Lun", value: 12 },
        { label: "Mar", value: 19 },
        { label: "Mié", value: 15 },
        { label: "Jue", value: 22 },
        { label: "Vie", value: 28 },
        { label: "Sáb", value: 34 },
        { label: "Dom", value: 25 },
      ],
    },
    "30d": {
      totalUsers: 142,
      newUsers: 45,
      towRequests: 89,
      aiDiagnoses: 245,
      avgResponseTime: "14 min",
      conversionRate: "91.8%",
      dailyData: [
        { label: "Semana 1", value: 48 },
        { label: "Semana 2", value: 65 },
        { label: "Semana 3", value: 82 },
        { label: "Semana 4", value: 95 },
      ],
    },
    year: {
      totalUsers: 142,
      newUsers: 142,
      towRequests: 620,
      aiDiagnoses: 1480,
      avgResponseTime: "13 min",
      conversionRate: "92.5%",
      dailyData: [
        { label: "T1", value: 240 },
        { label: "T2", value: 380 },
        { label: "T3", value: 490 },
        { label: "T4", value: 620 },
      ],
    },
    all: {
      totalUsers: 142,
      newUsers: 142,
      towRequests: 890,
      aiDiagnoses: 2150,
      avgResponseTime: "14 min",
      conversionRate: "93.0%",
      dailyData: [
        { label: "2024", value: 320 },
        { label: "2025", value: 680 },
        { label: "2026", value: 890 },
      ],
    },
  }[timeframe];

  const diagnosisCategories = [
    { name: "Sistema de Frenos & Fricción", count: 86, percentage: 35, color: "bg-[#FFBA00]" },
    { name: "Batería & Sistema Eléctrico", count: 68, percentage: 28, color: "bg-[#6D9773]" },
    { name: "Refrigeración & Temperatura", count: 47, percentage: 19, color: "bg-red-500" },
    { name: "Gestión de Motor & Sensores", count: 32, percentage: 13, color: "bg-[#0C3B2E]" },
    { name: "Transmisión & Suspensión", count: 12, percentage: 5, color: "bg-gray-400" },
  ];

  const userDistribution = [
    { role: "Conductores / Clientes", count: 96, pct: "68%" },
    { role: "Talleres Mecánicos", count: 26, pct: "18%" },
    { role: "Grúas de Rescate 24/7", count: 12, pct: "8%" },
    { role: "Tiendas de Repuestos", count: 8, pct: "6%" },
  ];

  const recentEvents = [
    {
      id: "EV-9401",
      date: "Hace 10 min",
      type: "Diagnóstico IA",
      description: "Toyota Hilux 2019 - Falla de Frenos / Pastillas",
      status: "Completado",
      badge: "sage",
    },
    {
      id: "EV-9400",
      date: "Hace 35 min",
      type: "Solicitud Grúa 24/7",
      description: "Zona Sur, La Paz - Auxilio por Batería Agotada",
      status: "Atendido",
      badge: "amber",
    },
    {
      id: "EV-9399",
      date: "Hace 1 hora",
      type: "Nuevo Registro",
      description: "Taller Mecánico 'AutoMax Express' (Negocio)",
      status: "Verificado",
      badge: "forest",
    },
    {
      id: "EV-9398",
      date: "Hace 2 horas",
      type: "Vehículo Agregado",
      description: "Suzuki Grand Vitara (Placa: 4022-BNP)",
      status: "Registrado",
      badge: "sage",
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  const maxVal = Math.max(...metrics.dailyData.map((d) => d.value));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* HEADER SUPERIOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold text-[#6D9773] hover:text-[#0C3B2E] transition"
          >
            <ArrowLeft size={14} />
            Volver al Panel de Administración
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0C3B2E]">
              Reportes y Métricas Operativas
            </h1>
            <Badge variant="amber" size="sm" withDot pulseDot>
              Tiempo Real
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Estadísticas consolidadas de tráfico, diagnósticos de IA, auxilio vial y usuarios en Bolivia
          </p>
        </div>

        {/* ACCIONES DE EXPORTACIÓN */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={<Printer size={15} />}
            onClick={handlePrint}
            className="bg-white border-[#DCE7DE] hover:border-[#6D9773]"
          >
            Imprimir / PDF
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download size={15} />}
            onClick={() =>
              downloadMetricsReport(
                adminUser.name,
                adminUser.email,
                timeframe,
                metrics,
                diagnosisCategories,
                userDistribution
              )
            }
            className="shadow-sm"
          >
            Descargar CSV
          </Button>
        </div>
      </div>

      {/* FILTROS DE RANGO TEMPORAL */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#6D9773]" />
          <span className="text-xs font-bold text-gray-700">Rango de análisis:</span>
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 border border-[#DCE7DE] shadow-xs">
          {[
            { id: "7d", label: "Últimos 7 días" },
            { id: "30d", label: "Últimos 30 días" },
            { id: "year", label: "Este año" },
            { id: "all", label: "Histórico completo" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTimeframe(tab.id as typeof timeframe)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                timeframe === tab.id
                  ? "bg-[#0C3B2E] text-white shadow-xs"
                  : "text-gray-600 hover:text-[#0C3B2E] hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TARJETAS DE KPIS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Usuarios Activos"
          value={metrics.totalUsers}
          subtitle={`+${metrics.newUsers} en este periodo`}
          icon={<Users size={22} className="text-[#6D9773]" />}
          trend={{ value: "+14% vs anterior", isPositive: true }}
        />

        <StatCard
          title="Diagnósticos IA"
          value={metrics.aiDiagnoses}
          subtitle="Consultas mecánicas procesadas"
          icon={<Brain size={22} className="text-[#6D9773]" />}
          trend={{ value: "+28% de adopción", isPositive: true }}
        />

        <StatCard
          title="Solicitudes de Auxilio"
          value={metrics.towRequests}
          subtitle="Grúas y talleres coordinados"
          icon={<Truck size={22} className="text-[#6D9773]" />}
          trend={{ value: metrics.conversionRate + " atendidas", isPositive: true }}
        />

        <StatCard
          title="Tiempo de Respuesta"
          value={metrics.avgResponseTime}
          subtitle="Promedio desde solicitud a contacto"
          icon={<Clock size={22} className="text-[#6D9773]" />}
          trend={{ value: "Óptimo", isPositive: true }}
        />
      </div>

      {/* GRÁFICOS Y ANÁLISIS VECTORIAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Actividad de Solicitudes */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#0C3B2E]">
                Volumen de Asistencias y Diagnósticos
              </h3>
              <p className="text-xs text-gray-500">
                Evolución de la actividad de los conductores durante el periodo
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6D9773]">
              <TrendingUp size={16} />
              <span>Alta demanda en fines de semana</span>
            </div>
          </div>

          {/* Gráfico de barras SVG nativo */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-8 pb-2 px-2">
            {metrics.dailyData.map((d, i) => {
              const heightPct = Math.round((d.value / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-extrabold text-[#0C3B2E] opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.value}
                  </div>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-[#0C3B2E] via-[#6D9773] to-[#FFBA00] transition-all duration-500 hover:brightness-110 shadow-xs cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                    title={`${d.label}: ${d.value} solicitudes`}
                  />
                  <span className="text-[11px] font-bold text-gray-500">{d.label}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Distribución de Usuarios por Tipo */}
        <Card>
          <div className="border-b border-gray-100 pb-4 mb-5">
            <h3 className="text-base font-bold text-[#0C3B2E]">
              Distribución de Comunidad
            </h3>
            <p className="text-xs text-gray-500">
              Desglose de roles en la plataforma
            </p>
          </div>

          <div className="space-y-4">
            {userDistribution.map((item, idx) => (
              <div key={idx} className="rounded-2xl bg-[#F8FAF8] p-3.5 border border-[#DCE7DE]">
                <div className="flex items-center justify-between text-xs font-bold text-[#0C3B2E] mb-1.5">
                  <span>{item.role}</span>
                  <span className="text-[#6D9773]">{item.pct} ({item.count})</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#6D9773] h-full rounded-full"
                    style={{ width: item.pct }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FALLAS MÁS FRECUENTES DETECTADAS POR IA */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-[#6D9773]" />
            <h3 className="text-base font-bold text-[#0C3B2E]">
              Fallas Mecánicas más Consultadas al Asistente IA
            </h3>
          </div>
          <span className="text-xs text-gray-500">
            Total {metrics.aiDiagnoses} consultas procesadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {diagnosisCategories.map((item, i) => (
            <div key={i} className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE] flex flex-col justify-between">
              <div>
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${item.color} mb-2`} />
                <h4 className="text-xs font-bold text-[#0C3B2E] leading-tight">
                  {item.name}
                </h4>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-end justify-between">
                <span className="text-2xl font-extrabold text-[#0C3B2E]">{item.percentage}%</span>
                <span className="text-xs font-semibold text-gray-500">{item.count} casos</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* REGISTRO DE EVENTOS RECIENTES */}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0C3B2E]">
            Registro de Eventos y Actividad Reciente
          </h3>
          <span className="text-xs text-gray-400 font-semibold">Últimos logs registrados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAF8] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-3.5">ID Evento</th>
                <th className="px-6 py-3.5">Tipo</th>
                <th className="px-6 py-3.5">Detalle</th>
                <th className="px-6 py-3.5">Tiempo</th>
                <th className="px-6 py-3.5 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-[#F8FAF8]/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-gray-600">{ev.id}</td>
                  <td className="px-6 py-4 font-bold text-[#0C3B2E]">{ev.type}</td>
                  <td className="px-6 py-4 text-gray-600">{ev.description}</td>
                  <td className="px-6 py-4 text-gray-400">{ev.date}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex rounded-full bg-[#E8F0E9] px-2.5 py-1 text-[11px] font-bold text-[#0C3B2E]">
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
