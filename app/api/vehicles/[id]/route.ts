import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
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
    } = body;

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
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $10 AND user_id = $11
      RETURNING *
      `,
      [
        plate ? plate.toUpperCase().trim() : null,
        brand ? brand.trim() : null,
        model ? model.trim() : null,
        year ? parseInt(year.toString(), 10) : null,
        color ? color.trim() : null,
        type,
        fuel_type,
        transmission,
        mileage ? parseInt(mileage.toString(), 10) : null,
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
