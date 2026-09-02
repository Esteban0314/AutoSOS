import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/db";

export async function PUT(request: Request) {
  try {
    // Obtener usuario de la sesión
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay una sesión activa",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { name, phone } = body;

    // Validar nombre
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "El nombre debe tener al menos 2 caracteres",
        },
        { status: 400 }
      );
    }

    // Actualizar usuario
    const result = await pool.query(
      `
      UPDATE users
      SET
        name = $1,
        phone = $2
      WHERE id = $3
      RETURNING
        id,
        name,
        email,
        phone,
        role
      `,
      [
        name.trim(),
        phone?.trim() || null,
        user.id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Error actualizando perfil:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}