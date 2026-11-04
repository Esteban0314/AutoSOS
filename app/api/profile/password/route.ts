import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

export async function PUT(request: Request) {
  try {
    const sessionUser = await getCurrentUser();

    if (!sessionUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No hay una sesión activa",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validaciones básicas
    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Debes ingresar tu contraseña actual",
        },
        { status: 400 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "La nueva contraseña debe tener al menos 6 caracteres",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Las contraseñas no coinciden",
        },
        { status: 400 }
      );
    }

    // Obtener la contraseña actual hasheada de la base de datos
    const userResult = await pool.query(
      `SELECT id, password_hash FROM users WHERE id = $1`,
      [sessionUser.id]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no encontrado",
        },
        { status: 404 }
      );
    }

    const dbUser = userResult.rows[0];

    // Verificar contraseña actual
    const isCurrentValid = await bcrypt.compare(
      currentPassword,
      dbUser.password_hash
    );

    if (!isCurrentValid) {
      return NextResponse.json(
        {
          success: false,
          message: "La contraseña actual es incorrecta. Si ingresaste con una clave temporal, asegúrate de escribirla exactamente como te llegó al correo.",
        },
        { status: 400 }
      );
    }

    // Hashear la nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // Actualizar en base de datos
    await pool.query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      `,
      [newPasswordHash, sessionUser.id]
    );

    return NextResponse.json({
      success: true,
      message: "¡Contraseña actualizada exitosamente! Ahora puedes iniciar sesión con tu nueva clave.",
    });
  } catch (error) {
    console.error("Error al actualizar contraseña:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor al actualizar contraseña",
      },
      { status: 500 }
    );
  }
}
