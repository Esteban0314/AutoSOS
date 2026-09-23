import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { sendVerificationCodeEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { email, password } = body;

    // Validar que lleguen los datos
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    // Buscar usuario
    const result = await pool.query(
      `
      SELECT id, name, email, password_hash, phone, role
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Email o contraseña incorrectos",
        },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Comparar contraseña con el hash almacenado
    const passwordCorrect = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Email o contraseña incorrectos",
        },
        { status: 401 }
      );
    }
    // Generar código de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Crear hash del código
    const codeHash = await bcrypt.hash(verificationCode, 12);

    // Expiración: 10 minutos
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Guardar código
    await pool.query(
      `
      INSERT INTO verification_codes
        (user_id, code_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [user.id, codeHash, expiresAt]
    );

    // Enviar código de verificación por correo electrónico
    await sendVerificationCodeEmail(user.email, user.name, verificationCode);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      message: "Se ha enviado un código de verificación a tu correo electrónico",
      userId: user.id,
    });
    // No devolver la contraseña al cliente
    return NextResponse.json({
      success: true,
      message: "Credenciales correctas",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}