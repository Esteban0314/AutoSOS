import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

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

    const result = await pool.query(
      `
      INSERT INTO vehicles
        (user_id, plate, brand, model, year, color, type, fuel_type, transmission, mileage)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
        created_at
      `,
      [
        user.id,
        plate.toUpperCase().trim(),
        brand.trim(),
        model.trim(),
        parseInt(year.toString(), 10),
        color.trim(),
        type,
        fuel_type,
        transmission,
        mileage ? parseInt(mileage.toString(), 10) : null,
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
