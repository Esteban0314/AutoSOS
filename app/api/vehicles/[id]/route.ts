import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

function normalizeAndValidatePlate(rawPlate: string): { isValid: boolean; normalized: string; error?: string } {
  if (!rawPlate) {
    return { isValid: false, normalized: "", error: "La placa es obligatoria" };
  }

  let cleaned = rawPlate.toUpperCase().trim().replace(/[\s_]/g, "-");

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
      error: "La placa no cumple el formato legal boliviano RUAT (ej. 4589-KTL o 982-ABC).",
    };
  }

  return { isValid: true, normalized: cleaned };
}

// DELETE - Eliminar un vehículo del usuario
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

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
      DELETE FROM vehicles
      WHERE id = $1 AND user_id = $2
      RETURNING id
      `,
      [id, user.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehículo no encontrado o no tienes permisos para eliminarlo",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vehículo eliminado correctamente de tu garage",
    });
  } catch (error) {
    console.error("Error eliminando vehículo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al eliminar el vehículo",
      },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un vehículo
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    const { id } = await params;

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
      type,
      fuel_type,
      transmission,
      mileage,
      image_url,
    } = body;

    let normalizedPlate: string | null = null;
    if (plate) {
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
      normalizedPlate = plateValidation.normalized;
    }

    let numericYear: number | null = null;
    if (year) {
      const currentYear = new Date().getFullYear();
      numericYear = parseInt(year.toString(), 10);
      if (isNaN(numericYear) || numericYear < 1970 || numericYear > currentYear + 1) {
        return NextResponse.json(
          {
            success: false,
            message: `El año debe estar entre 1970 y ${currentYear + 1}`,
          },
          { status: 400 }
        );
      }
    }

    const result = await pool.query(
      `
      UPDATE vehicles
      SET
        plate = COALESCE($1, plate),
        brand = COALESCE($2, brand),
        model = COALESCE($3, model),
        year = COALESCE($4, year),
        color = COALESCE($5, color),
        type = COALESCE($6, type),
        fuel_type = COALESCE($7, fuel_type),
        transmission = COALESCE($8, transmission),
        mileage = COALESCE($9, mileage),
        image_url = COALESCE($10, image_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND user_id = $12
      RETURNING *
      `,
      [
        normalizedPlate,
        brand ? brand.trim() : null,
        model ? model.trim() : null,
        numericYear,
        color ? color.trim() : null,
        type,
        fuel_type,
        transmission,
        mileage !== undefined && mileage !== null ? parseInt(mileage.toString(), 10) : null,
        image_url !== undefined ? image_url : null,
        id,
        user.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Vehículo no encontrado o no tienes permisos",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Vehículo actualizado correctamente",
      vehicle: result.rows[0],
    });
  } catch (error) {
    console.error("Error actualizando vehículo:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar los datos del vehículo",
      },
      { status: 500 }
    );
  }
}
