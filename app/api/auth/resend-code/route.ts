import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { sendVerificationCodeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de usuario requerido",
        },
        { status: 400 }
      );
    }

    const userResult = await pool.query(
      `SELECT id, name, email FROM users WHERE id = $1`,
      [userId]
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

    const user = userResult.rows[0];

    // Generar nuevo código de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const codeHash = await bcrypt.hash(verificationCode, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Guardar nuevo código
    await pool.query(
      `
      INSERT INTO verification_codes
        (user_id, code_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [user.id, codeHash, expiresAt]
    );

    // Enviar por correo
    await sendVerificationCodeEmail(user.email, user.name, verificationCode);

    return NextResponse.json({
      success: true,
      message: "Se ha reenviado un nuevo código a tu correo electrónico",
    });
  } catch (error) {
    console.error("Error reenviando código 2FA:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error al reenviar el código",
      },
      { status: 500 }
    );
  }
}
