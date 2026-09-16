import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      role = "CUSTOMER",
      businessType,
      businessAddress,
    } = body;

    // Validación básica de campos requeridos
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Nombre, correo y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message: "La contraseña debe tener al menos 6 caracteres",
        },
        { status: 400 }
      );
    }

    const assignedRole = role === "BUSINESS" ? "BUSINESS" : "CUSTOMER";

    // Verificar si el correo ya existe
    const existingUser = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      `,
      [email.toLowerCase().trim()]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "El correo electrónico ya se encuentra registrado",
        },
        { status: 409 }
      );
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Insertar el nuevo usuario en la base de datos
    const result = await pool.query(
      `
      INSERT INTO users
        (name, email, password_hash, phone, role)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        id,
        name,
        email,
        phone,
        role,
        created_at
      `,
      [
        name.trim(),
        email.toLowerCase().trim(),
        passwordHash,
        phone ? phone.trim() : null,
        assignedRole,
      ]
    );

    const newUser = result.rows[0];

    // Generar código 2FA de 6 dígitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const codeHash = await bcrypt.hash(verificationCode, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `
      INSERT INTO verification_codes
        (user_id, code_hash, expires_at)
      VALUES ($1, $2, $3)
      `,
      [newUser.id, codeHash, expiresAt]
    );

    if (assignedRole === "BUSINESS" && (businessType || businessAddress)) {
      console.log(
        `[AutoSOS Business] Tipo: ${businessType || "Taller"}, Dirección: ${businessAddress || "N/A"}`
      );
    }

    console.log(`[AutoSOS] Código 2FA para registro ${newUser.email}: ${verificationCode}`);

    return NextResponse.json(
      {
        success: true,
        requiresVerification: true,
        message: "Cuenta creada exitosamente. Se ha generado un código de verificación.",
        userId: newUser.id,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocurrió un error al procesar el registro",
      },
      { status: 500 }
    );
  }
}
