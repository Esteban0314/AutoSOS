"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Car,
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Sparkles,
  RefreshCw,
  Clock,
  DollarSign,
  PhoneCall,
  Flame,
  Gauge,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbare";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import BusinessCard from "@/components/ui/BusinessCard";
import { Business } from "@/data/businesses";

type DiagnosisCategory = "motor" | "brakes" | "electrical" | "cooling" | "transmission";

interface DiagnosisData {
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  severityLabel: string;
  confidence: number;
  estimatedCost: string;
  summary: string;
  possibleCauses: {
    cause: string;
    probability: number;
    description: string;
  }[];
  immediateSteps: string[];
  recommendedSpecialties: string[];
  matchedBusinesses: Business[];
  engineUsed?: string;
  altitudeNote?: string;
}

export default function DiagnosticoPage() {
  const [step, setStep] = useState<"input" | "scanning" | "result">("input");

  // Datos del vehículo
  const [brand, setBrand] = useState("Toyota");
  const [model, setModel] = useState("Corolla / Hilux");
  const [year, setYear] = useState("2018");

  // Selección de síntomas
  const [selectedCategory, setSelectedCategory] = useState<DiagnosisCategory>("motor");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisData | null>(null);

  const categories = [
    {
      id: "motor" as DiagnosisCategory,
      name: "Motor y Combustión",
      icon: <Wrench size={18} />,
      symptoms: [
        "El motor cascabelea al acelerar en subidas",
        "Testigo Check Engine encendido en el tablero",
        "Pérdida notoria de potencia y respuesta",
        "El auto tiembla o vibra en ralentí",
      ],
    },
    {
      id: "brakes" as DiagnosisCategory,
      name: "Frenos y Suspensión",
      icon: <ShieldAlert size={18} />,
      symptoms: [
        "Chirrido agudo al presionar el pedal de freno",
        "El pedal se va hasta el fondo (esponjoso)",
        "El volante vibra fuertemente a más de 60 km/h",
        "Golpeteo seco metálico al pasar baches",
      ],
    },
    {
      id: "electrical" as DiagnosisCategory,
      name: "Batería y Sistema Eléctrico",
      icon: <Zap size={18} />,
      symptoms: [
        "No arranca por las mañanas y hace clic repetitivo",
        "Luces delanteras tenues o parpadeantes al acelerar",
        "Testigo de batería encendido con el motor en marcha",
        "Batería se descarga tras 2 días sin usar",
      ],
    },
    {
      id: "cooling" as DiagnosisCategory,
      name: "Temperatura y Radiador",
      icon: <Flame size={18} />,
      symptoms: [
        "Aguja de temperatura sube por encima de la mitad",
        "Vapor o humo blanco saliendo por el capó",
        "Goteo de líquido refrigerante bajo el motor",
        "El electroventilador no enciende en tráfico lento",
      ],
    },
    {
      id: "transmission" as DiagnosisCategory,
      name: "Embrague y Transmisión",
      icon: <Gauge size={18} />,
      symptoms: [
        "El motor se revoluciona en subidas pero el auto no avanza (patina)",
        "Dificultad para engranar 1ra marcha o reversa",
        "Tirones o demora al pasar cambios en caja automática",
        "Zumbido o chillido con el pedal de embrague pisado",
      ],
    },
  ];

  const quickSuggestions = [
    "Cascabeleo en subidas de La Paz y pérdida de potencia",
    "Chirrido de frenos y pedal esponjoso al fondo",
    "No arranca en frío matutino (clic-clic)",
    "Código OBD-II P0300 (Falla múltiple en cilindros)",
    "Embrague patina en pendientes empinadas",
    "Humo negro por el escape y olor a gasolina",
    "Vibración en el volante al frenar a más de 70 km/h",
  ];

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  // DIAGNÓSTICO REAL SIN SIMULACIONES NI SETTIMEOUT FALSOS
  const startDiagnosis = async () => {
    if (selectedSymptoms.length === 0 && !customText.trim()) {
      setErrorMessage("Por favor selecciona al menos un síntoma o escribe lo que le pasa a tu auto en el cuadro de texto.");
      return;
    }

    setErrorMessage(null);
    setStep("scanning");

    try {
      const response = await fetch("/api/diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle: { brand, model, year },
          category: selectedCategory,
          symptoms: selectedSymptoms,
          customDescription: customText,
        }),
      });

      const data = await response.json();

      if (data.success && data.diagnosis) {
        setDiagnosisResult(data.diagnosis);
        setStep("result");
      } else {
        setErrorMessage(data.message || "No se pudo generar el diagnóstico. Por favor intenta nuevamente.");
        setStep("input");
      }
    } catch (error) {
      console.error("Error en diagnóstico:", error);
      setErrorMessage("Error de conexión al procesar el diagnóstico. Verifica tu conexión a internet.");
      setStep("input");
    }
  };

  const resetDiagnosis = () => {
    setDiagnosisResult(null);
    setSelectedSymptoms([]);
    setCustomText("");
    setErrorMessage(null);
    setStep("input");
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#0C3B2E] flex flex-col justify-between selection:bg-[#6D9773] selection:text-white">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1">
        {/* HERO BANNER */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white py-12 px-4 sm:px-6 border-b border-[#145341]">
          {/* Ambient Glows */}
          <div className="absolute right-10 -top-20 h-72 w-72 rounded-full bg-[#6D9773]/25 blur-3xl pointer-events-none" />
          <div className="absolute left-10 -bottom-20 h-72 w-72 rounded-full bg-[#FFBA00]/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#E8F0E9] border border-white/20 backdrop-blur-md mb-4 shadow-sm">
              <Sparkles size={14} className="text-[#FFBA00] animate-pulse" />
              <span>Motor de Inteligencia Artificial Automotriz</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Diagnóstico Automotriz con <span className="text-[#FFBA00]">Inteligencia Artificial</span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Describe los ruidos, vibraciones, fallas o códigos OBD-II de tu vehículo para obtener un análisis técnico detallado, costos en Bolivianos (Bs.) y talleres certificados en La Paz.
            </p>
          </div>
        </section>

        {/* PROCESO / PASOS */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
          {/* MENSAJE DE ERROR SI OCURRE */}
          {errorMessage && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-200 text-xs text-red-700 animate-enter-scale">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* PASO 1: ENTRADA DE DATOS */}
          {step === "input" && (
            <div className="space-y-8 animate-enter-scale">
              {/* SELECCIÓN DE VEHÍCULO */}
              <Card>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
                    <Car size={20} className="text-[#6D9773]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0C3B2E]">
                      1. Datos de tu Vehículo
                    </h3>
                    <p className="text-xs text-gray-500">
                      Permite a la IA calibrar las tolerancias mecánicas y altitud geográfica
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Marca
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Ej. Toyota, Suzuki, Nissan"
                      className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-2.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Modelo
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ej. Corolla, Hilux, Grand Vitara"
                      className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-2.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                      Año de Fabricación
                    </label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Ej. 2018"
                      className="w-full rounded-xl border border-[#DCE7DE] bg-white px-3.5 py-2.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20"
                    />
                  </div>
                </div>
              </Card>

              {/* SELECCIÓN DE SÍNTOMAS */}
              <Card>
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F0E9] text-[#0C3B2E]">
                    <Brain size={20} className="text-[#6D9773]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0C3B2E]">
                      2. Identifica los Síntomas o Fallas
                    </h3>
                    <p className="text-xs text-gray-500">
                      Selecciona una categoría o escribe directamente los síntomas
                    </p>
                  </div>
                </div>

                {/* Categorías tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSelectedSymptoms([]);
                      }}
                      className={`flex flex-col items-center gap-2 p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? "border-[#0C3B2E] bg-[#0C3B2E] text-white shadow-md"
                          : "border-[#DCE7DE] bg-white text-gray-700 hover:border-[#6D9773] hover:bg-[#F8FAF8]"
                      }`}
                    >
                      <span className={selectedCategory === cat.id ? "text-[#FFBA00]" : "text-[#6D9773]"}>
                        {cat.icon}
                      </span>
                      <span className="text-xs font-bold">{cat.name}</span>
                    </button>
                  ))}
                </div>

                {/* Lista de síntomas para la categoría seleccionada */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
                    Síntomas frecuentes en esta categoría (marca los que observes):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories
                      .find((c) => c.id === selectedCategory)
                      ?.symptoms.map((symptom, idx) => {
                        const isSelected = selectedSymptoms.includes(symptom);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleSymptom(symptom)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                              isSelected
                                ? "border-[#6D9773] bg-[#E8F0E9] text-[#0C3B2E] font-bold shadow-xs"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                isSelected
                                  ? "border-[#6D9773] bg-[#6D9773] text-white"
                                  : "border-gray-300 bg-white"
                              }`}
                            >
                              {isSelected && <CheckCircle2 size={14} />}
                            </div>
                            <span>{symptom}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Sugerencias Rápidas */}
                <div className="mb-5">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle size={13} className="text-[#6D9773]" />
                    <span>Ejemplos y casos comunes (haz clic para autocompletar):</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickSuggestions.map((sug, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCustomText(sug)}
                        className="rounded-full bg-[#F0F5F1] px-3 py-1 text-[11px] font-semibold text-[#0C3B2E] hover:bg-[#0C3B2E] hover:text-white transition cursor-pointer border border-[#DCE7DE]"
                      >
                        + {sug}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Descripción Libre / Códigos OBD-II */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    ¿Algo más que notes? Describe ruidos, olores o ingresa códigos OBD-II (ej. P0300, P0420):
                  </label>
                  <textarea
                    rows={3}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Ej. Siento un tirón al pasar a segunda marcha y cuando subo la autopista empieza a salir humo negro..."
                    className="w-full rounded-xl border border-[#DCE7DE] bg-white p-3.5 text-xs text-[#0C3B2E] outline-none focus:border-[#6D9773] focus:ring-2 focus:ring-[#6D9773]/20 resize-none"
                  />
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="yellow"
                    size="lg"
                    icon={<Sparkles size={18} />}
                    onClick={startDiagnosis}
                    className="font-extrabold shadow-md hover:shadow-[#FFBA00]/30 w-full sm:w-auto"
                  >
                    Generar Diagnóstico con IA
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* PASO 2: ANÁLISIS EN VIVO (SIN RETARDOS FALSOS) */}
          {step === "scanning" && (
            <div className="flex flex-col items-center justify-center p-12 sm:p-20 text-center animate-enter-scale">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-[#6D9773]/30 animate-ping" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#0C3B2E] to-[#145341] text-[#FFBA00] shadow-2xl border-4 border-white">
                  <Brain size={48} className="animate-pulse" />
                </div>
              </div>

              <h2 className="text-2xl font-extrabold text-[#0C3B2E]">
                Analizando {brand} {model} ({year})...
              </h2>

              <p className="mt-2 text-xs text-gray-500 max-w-md">
                Evaluando parámetros mecánicos, tolerancia en altitud (3,600 msnm) y bases técnicas especializadas...
              </p>

              <div className="mt-8 flex items-center gap-2 text-xs font-semibold text-[#6D9773]">
                <div className="h-2 w-2 rounded-full bg-[#6D9773] animate-ping" />
                <span>Procesando diagnóstico en tiempo real...</span>
              </div>
            </div>
          )}

          {/* PASO 3: INFORME DE RESULTADOS */}
          {step === "result" && diagnosisResult && (
            <div className="space-y-8 animate-enter-scale">
              {/* BANNER PRINCIPAL DE RESULTADO */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0C3B2E] via-[#0F4C3A] to-[#07261D] text-white p-6 sm:p-8 shadow-xl border border-[#145341]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/15 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#FFBA00] border border-white/20">
                      <Brain size={26} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant={
                            diagnosisResult.severity === "CRITICAL"
                              ? "danger"
                              : diagnosisResult.severity === "HIGH"
                              ? "amber"
                              : "sage"
                          }
                          size="sm"
                          withDot
                          pulseDot
                        >
                          {diagnosisResult.severityLabel}
                        </Badge>

                        <span className="text-xs text-gray-300">
                          Precisión: {diagnosisResult.confidence}%
                        </span>

                        {diagnosisResult.engineUsed && (
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-[#FFBA00] border border-white/15">
                            {diagnosisResult.engineUsed}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {diagnosisResult.title}
                      </h2>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw size={14} />}
                    onClick={resetDiagnosis}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Nueva Consulta
                  </Button>
                </div>

                <p className="mt-6 text-sm text-gray-200 leading-relaxed max-w-3xl">
                  {diagnosisResult.summary}
                </p>

                {diagnosisResult.altitudeNote && (
                  <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs text-[#E8F0E9] border border-white/15">
                    <span className="text-[#FFBA00] font-bold">🏔️ Factor Altitud:</span>
                    <span>{diagnosisResult.altitudeNote}</span>
                  </div>
                )}

                {/* Métricas estimadas */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15">
                    <div className="flex items-center gap-2 text-xs text-[#FFBA00] font-bold uppercase">
                      <DollarSign size={16} />
                      <span>Costo Estimado de Reparación</span>
                    </div>
                    <p className="mt-1.5 text-2xl font-extrabold text-white">
                      {diagnosisResult.estimatedCost}
                    </p>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Incluye repuestos sugeridos y mano de obra promedio en La Paz
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/15">
                    <div className="flex items-center gap-2 text-xs text-[#6D9773] font-bold uppercase">
                      <Clock size={16} />
                      <span>Tiempo Estimado en Taller</span>
                    </div>
                    <p className="mt-1.5 text-2xl font-extrabold text-white">
                      2 a 5 Horas
                    </p>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Sujeto a inspección física en bahía y disponibilidad de stock
                    </p>
                  </div>
                </div>
              </div>

              {/* CAUSAS PROBABLES & ACCIONES DE SEGURIDAD */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Causas Probables */}
                <Card>
                  <h3 className="text-base font-bold text-[#0C3B2E] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-[#FFBA00]" />
                    <span>Causas Raíz Detectadas</span>
                  </h3>

                  <div className="space-y-4">
                    {diagnosisResult.possibleCauses.map((item, idx) => (
                      <div key={idx} className="rounded-2xl bg-[#F8FAF8] p-4 border border-[#DCE7DE]">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-xs font-bold text-[#0C3B2E]">{item.cause}</h4>
                          <span className="rounded-full bg-[#E8F0E9] px-2.5 py-0.5 text-[11px] font-extrabold text-[#6D9773]">
                            {item.probability}% prob.
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Acciones de Seguridad Inmediatas */}
                <Card>
                  <h3 className="text-base font-bold text-[#0C3B2E] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#6D9773]" />
                    <span>Recomendaciones Técnicas y de Seguridad</span>
                  </h3>

                  <ul className="space-y-3">
                    {diagnosisResult.immediateSteps.map((stepText, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-gray-700 leading-relaxed">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6D9773] text-white text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <span>{stepText}</span>
                      </li>
                    ))}
                  </ul>

                  {diagnosisResult.severity === "CRITICAL" && (
                    <div className="mt-6 rounded-2xl bg-red-50 p-4 border border-red-200">
                      <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span>¡Alerta Crítica! No continúes conduciendo</span>
                      </div>
                      <p className="text-[11px] text-red-600 mt-1">
                        Existe alto riesgo de daño irreversible al motor o pérdida de frenos. Se recomienda solicitar auxilio de grúa.
                      </p>
                      <a href="tel:+59170000000" className="inline-block mt-3 w-full">
                        <Button variant="danger" fullWidth size="sm" icon={<PhoneCall size={14} />}>
                          Llamar Grúa de Emergencia 24/7
                        </Button>
                      </a>
                    </div>
                  )}
                </Card>
              </div>

              {/* TALLERES Y SERVICIOS RECOMENDADOS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0C3B2E]">
                      Talleres y Especialistas Recomendados en La Paz
                    </h3>
                    <p className="text-xs text-gray-500">
                      Establecimientos certificados para solucionar esta falla técnica en tu zona
                    </p>
                  </div>

                  <Link href="/servicios" className="text-xs font-bold text-[#6D9773] hover:underline">
                    Ver todos en el mapa →
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {diagnosisResult.matchedBusinesses.slice(0, 3).map((biz) => (
                    <BusinessCard
                      key={biz.id}
                      id={biz.id}
                      type={biz.type}
                      name={biz.name}
                      description={biz.description}
                      rating={biz.rating}
                      reviews={biz.reviews}
                      distance={biz.distance}
                      location={biz.location}
                      isOpen={biz.open}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
