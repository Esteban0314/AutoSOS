import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

// Validación de formato de placa boliviana (RUAT / Tránsito)
// Formatos admitidos: 3 a 4 dígitos + guión + 3 letras (ej: 4589-KTL, 982-ABC)
function normalizeAndValidatePlate(rawPlate: string): { isValid: boolean; normalized: string; error?: string } {
  if (!rawPlate) {
    return { isValid: false, normalized: "", error: "La placa es obligatoria" };
  }

  let cleaned = rawPlate.toUpperCase().trim().replace(/[\s_]/g, "-");

  // Si no tiene guión pero tiene el largo adecuado, insertarlo automáticamente
  // ej: 4589KTL -> 4589-KTL, 982ABC -> 982-ABC
  if (!cleaned.includes("-")) {
    const match = cleaned.match(/^([0-9]{3,4})([A-Z]{3})$/);
    if (match) {
      cleaned = `${match[1]}-${match[2]}`;
    }
  }

  const plateRegex = /^[1-9][0-9]{2,3}-[A-Z]{3}$/;

  if (!plateRegex.test(cleaned)) {
    return {
      isValid: false,
      normalized: cleaned,
      error: "La placa no cumple el formato legal boliviano RUAT. Debe contener 3 o 4 números seguidos de 3 letras (ej. 4589-KTL o 982-ABC).",
    };
  }

  return { isValid: true, normalized: cleaned };
}

// GET - Obtener todos los vehículos del usuario autenticado
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No estás autenticado",
        },
        { status: 401 }
      );
    }

    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        plate,
        brand,
        model,
        year,
        color,
        type,
        fuel_type,
        transmission,
        mileage,
        image_url,
        created_at
      FROM vehicles
      WHERE user_id = $1
      ORDER BY id DESC
      `,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      vehicles: result.rows,
    });
  } catch (error) {
    console.error("Error obteniendo vehículos:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al consultar la base de datos de vehículos",
      },
      { status: 500 }
    );
  }
}

// POST - Registrar un nuevo vehículo para el usuario autenticado
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No estás autenticado",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      plate,
      brand,
      model,
      year,
      color,
      type = "Sedán",
      fuel_type = "Gasolina",
      transmission = "Manual",
      mileage,
      image_url,
    } = body;

    if (!plate || !brand || !model || !year || !color) {
      return NextResponse.json(
        {
          success: false,
          message: "Placa, marca, modelo, año y color son obligatorios",
        },
        { status: 400 }
      );
    }

    // 1. Validar placa boliviana
    const plateValidation = normalizeAndValidatePlate(plate);
    if (!plateValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: plateValidation.error,
        },
        { status: 400 }
      );
    }

    // 2. Validar rango de año
    const currentYear = new Date().getFullYear();
    const numericYear = parseInt(year.toString(), 10);
    if (isNaN(numericYear) || numericYear < 1970 || numericYear > currentYear + 1) {
      return NextResponse.json(
        {
          success: false,
          message: `El año del vehículo debe estar entre 1970 y ${currentYear + 1}`,
        },
        { status: 400 }
      );
    }

    // 3. Validar kilometraje
    let numericMileage: number | null = null;
    if (mileage !== null && mileage !== undefined && mileage !== "") {
      numericMileage = parseInt(mileage.toString(), 10);
      if (isNaN(numericMileage) || numericMileage < 0 || numericMileage > 1000000) {
        return NextResponse.json(
          {
            success: false,
            message: "El kilometraje debe ser un valor positivo válido (máximo 1,000,000 km)",
          },
          { status: 400 }
        );
      }
    }

    // 4. Validar duplicidad de placa para este usuario
    const existingVehicle = await pool.query(
      `SELECT id FROM vehicles WHERE user_id = $1 AND plate = $2`,
      [user.id, plateValidation.normalized]
    );

    if (existingVehicle.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Ya tienes registrado un vehículo con la placa ${plateValidation.normalized} en tu garage`,
        },
        { status: 409 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO vehicles
        (user_id, plate, brand, model, year, color, type, fuel_type, transmission, mileage, image_url)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING
        id,
        user_id,
        plate,
        brand,
        model,
        year,
        color,
        type,
        fuel_type,
        transmission,
        mileage,
        image_url,
        created_at
      `,
      [
        user.id,
        plateValidation.normalized,
        brand.trim(),
        model.trim(),
        numericYear,
        color.trim(),
        type,
        fuel_type,
        transmission,
        numericMileage,
        image_url || null,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Vehículo registrado correctamente en tu garage",
        vehicle: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registrando vehículo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al guardar el vehículo",
      },
      { status: 500 }
    );
  }
}
