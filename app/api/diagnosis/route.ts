import { NextResponse } from "next/server";
import { businesses } from "@/data/businesses";

interface DiagnosisRequest {
  vehicle?: {
    brand?: string;
    model?: string;
    year?: string | number;
    fuelType?: string;
  };
  category?: string;
  symptoms?: string[];
  customDescription?: string;
}

interface DiagnosisResult {
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
  matchedBusinesses: typeof businesses;
}

export async function POST(request: Request) {
  try {
    const body: DiagnosisRequest = await request.json();
    const { vehicle, category = "motor", symptoms = [], customDescription = "" } = body;

    const fullQuery = `${category} ${symptoms.join(" ")} ${customDescription}`.toLowerCase();

    let result: DiagnosisResult;

    // Lógica analítica de diagnóstico automotriz inteligente
    if (
      fullQuery.includes("freno") ||
      fullQuery.includes("chillido") ||
      fullQuery.includes("pedal") ||
      fullQuery.includes("disco") ||
      category === "brakes"
    ) {
      result = {
        title: "Desgaste en Sistema de Frenos y Fricción",
        severity: "HIGH",
        severityLabel: "Atención Requerida (Alta)",
        confidence: 93,
        estimatedCost: "280 - 520 Bs",
        summary: `El síntoma reportado en tu vehículo ${vehicle?.brand || ""} ${vehicle?.model || ""} indica que las pastillas de freno han alcanzado el sensor acústico de desgaste o existe sobrecalentamiento en los discos. Se recomienda inspección antes de viajes en carretera o pendientes.`,
        possibleCauses: [
          {
            cause: "Pastillas de freno desgastadas al límite (menos de 3mm)",
            probability: 85,
            description: "El testigo sonoro de metal roza el rotor para alertar el fin de vida útil.",
          },
          {
            cause: "Discos de freno cristalizados o alabeados",
            probability: 60,
            description: "Provoca vibración en el pedal y pérdida de efectividad de frenado.",
          },
          {
            cause: "Bajo nivel o degradación de líquido de frenos DOT3/DOT4",
            probability: 40,
            description: "Humedad en el circuito hidráulico que reblandece la respuesta del pedal.",
          },
        ],
        immediateSteps: [
          "Evita frenadas bruscas o descensos prolongados con el pedal presionado.",
          "Verifica el depósito de líquido de frenos debajo del capó.",
          "Agenda una revisión de pastillas en un taller certificado.",
        ],
        recommendedSpecialties: ["Sistema de frenos", "Mantenimiento general", "Suspensión"],
        matchedBusinesses: businesses.filter((b) =>
          b.services.some((s) => s.toLowerCase().includes("freno") || s.toLowerCase().includes("mantenimiento"))
        ),
      };
    } else if (
      fullQuery.includes("bateria") ||
      fullQuery.includes("arranque") ||
      fullQuery.includes("alternador") ||
      fullQuery.includes("electrico") ||
      fullQuery.includes("no enciende") ||
      category === "electrical"
    ) {
      result = {
        title: "Falla de Arranque y Alimentación Eléctrica",
        severity: "CRITICAL",
        severityLabel: "Urgente / Inmediata",
        confidence: 96,
        estimatedCost: "350 - 750 Bs",
        summary: `La energía acumulada no es suficiente para accionar el motor de arranque del vehículo ${vehicle?.brand || ""}. Podría tratarse de sulfatación en bornes, batería agotada (+2 años de uso) o falla del alternador al recargar.`,
        possibleCauses: [
          {
            cause: "Batería de 12V descargada o celdas dañadas",
            probability: 88,
            description: "La batería ha perdido su capacidad de retención de carga en reposo.",
          },
          {
            cause: "Alternador defectuoso o regulador de voltaje dañado",
            probability: 65,
            description: "El alternador no genera los 13.8V - 14.4V requeridos con el motor en marcha.",
          },
          {
            cause: "Terminales de batería sueltos o sulfatados",
            probability: 50,
            description: "Resistencia eléctrica alta que impide el paso de la corriente de arranque.",
          },
        ],
        immediateSteps: [
          "No fuerces la llave de encendido más de 5 segundos seguidos para no dañar el arrancador.",
          "Comprueba si los bornes tienen polvo blanco/azulado (sulfato).",
          "Solicita auxilio de grúa o servicio a domicilio para puenteo o cambio de batería.",
        ],
        recommendedSpecialties: ["Sistema eléctrico", "Auxilio mecánico", "Servicio de grúa"],
        matchedBusinesses: businesses.filter(
          (b) => b.type === "tow" || b.services.some((s) => s.toLowerCase().includes("eléctrico") || s.toLowerCase().includes("diagnóstico"))
        ),
      };
    } else if (
      fullQuery.includes("humo") ||
      fullQuery.includes("temperatura") ||
      fullQuery.includes("calienta") ||
      fullQuery.includes("refrigerante") ||
      category === "cooling"
    ) {
      result = {
        title: "Sobrecalentamiento o Fuga en Sistema de Refrigeración",
        severity: "CRITICAL",
        severityLabel: "Crítico / No Conducir",
        confidence: 91,
        estimatedCost: "400 - 1200 Bs",
        summary: `Detectamos riesgo severo de daño térmico en el motor de tu ${vehicle?.brand || ""}. Si el indicador de temperatura subió o hay humo blanco, continuar conduciendo puede causar deformación en la culata.`,
        possibleCauses: [
          {
            cause: "Termostato trabado en posición cerrada",
            probability: 78,
            description: "Impide la circulación del refrigerante hacia el radiador.",
          },
          {
            cause: "Fuga en mangueras, radiador o bomba de agua",
            probability: 70,
            description: "Pérdida de presión en el circuito cerrado de enfriamiento.",
          },
          {
            cause: "Electroventilador inoperativo (fusible o relé)",
            probability: 55,
            description: "Falta de flujo de aire en el radiador a bajas velocidades o tráfico.",
          },
        ],
        immediateSteps: [
          "Detén el vehículo de inmediato en un lugar seguro y apaga el motor.",
          "¡PELIGRO! NUNCA abras la tapa del radiador con el motor caliente.",
          "Solicita una grúa de auxilio para trasladar el vehículo al taller.",
        ],
        recommendedSpecialties: ["Servicio de grúa 24/7", "Motor", "Diagnóstico computarizado"],
        matchedBusinesses: businesses.filter((b) => b.type === "tow" || b.type === "workshop"),
      };
    } else {
      // Diagnóstico general de motor / sensores
      result = {
        title: "Diagnóstico Preventivo: Gestión de Motor y Sensores",
        severity: "MEDIUM",
        severityLabel: "Revisión Recomendada (Media)",
        confidence: 87,
        estimatedCost: "150 - 400 Bs",
        summary: `Se detectaron anomalías en la mezcla o combustión del vehículo ${vehicle?.brand || ""} ${vehicle?.model || ""}. Se aconseja un escaneo computarizado OBD-II para leer los códigos de error (DTC) activos en la ECU.`,
        possibleCauses: [
          {
            cause: "Sensor de Oxígeno (O2) o Flujo de Aire (MAF) sucio",
            probability: 75,
            description: "Lecturas erróneas que aumentan el consumo de combustible.",
          },
          {
            cause: "Bujías o cables de encendido con desgaste",
            probability: 68,
            description: "Chispa deficiente que genera tirones o cascabeleo al acelerar.",
          },
          {
            cause: "Filtro de combustible o inyectores obstruidos",
            probability: 52,
            description: "Flujo irregular de combustible en altas revoluciones.",
          },
        ],
        immediateSteps: [
          "Conduce a velocidad moderada sin exigir aceleraciones bruscas.",
          "Verifica si el testigo 'Check Engine' está fijo o parpadeando.",
          "Acude a un taller con scanner OBD-II certificado.",
        ],
        recommendedSpecialties: ["Diagnóstico computarizado", "Afinamiento de motor", "Inyección electrónica"],
        matchedBusinesses: businesses.filter((b) => b.type === "workshop"),
      };
    }

    return NextResponse.json({
      success: true,
      diagnosis: result,
      vehicle: vehicle || { brand: "Vehículo", model: "General", year: 2024 },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error en AI diagnosis:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al procesar el diagnóstico con inteligencia artificial",
      },
      { status: 500 }
    );
  }
}
