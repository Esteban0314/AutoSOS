import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sendTemporaryPasswordEmail } from "@/lib/email";
import { defaultPackages } from "@/data/businesses";

// Función generadora de contraseñas de alta seguridad
function generateSecurePassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*";
  const allChars = upper + lower + numbers + symbols;

  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 6; i++) {
    pwd += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return pwd.split("").sort(() => 0.5 - Math.random()).join("");
}

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Cliente Conductor",
  ADMIN: "Administrador de Plataforma",
  WORKSHOP: "Taller Mecánico Especializado",
  TOW: "Servicio de Grúa y Auxilio Vial",
  PARTS_STORE: "Tienda de Repuestos y Autopartes",
};

// GET - Obtener todos los usuarios
export async function GET() {
  try {
    await requireAdmin();

    const result = await pool.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "No estás autenticado",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "No tienes permisos de administrador",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error obteniendo usuarios",
      },
      { status: 500 }
    );
  }
}

// POST - Crear usuario con contraseña auto-generada y envío directo a correo
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const {
      name,
      email,
      phone,
      role = "CUSTOMER",
      // Campos de negocio específicos
      business_name,
      nit,
      address,
      zone,
      schedule,
      specialties,
      bay_capacity,
      tow_type,
      tow_capacity,
      has_delivery,
    } = body;

    // Validaciones básicas: El administrador NO proporciona la contraseña
    if (!name || !email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Nombre, email y rol son obligatorios",
        },
        { status: 400 }
      );
    }

    // Comprobar si el email ya existe
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
          message: "El correo electrónico ya está registrado en el sistema",
        },
        { status: 409 }
      );
    }

    // PROTOCOLO DE SEGURIDAD:
    // La contraseña se genera de forma aleatoria y criptográfica
    const tempPassword = generateSecurePassword();
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Crear usuario en la tabla users
    const userResult = await pool.query(
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
        role,
      ]
    );

    const newUser = userResult.rows[0];

    // Si es un rol de negocio, registrar el perfil del negocio en la tabla businesses
    if (["WORKSHOP", "TOW", "PARTS_STORE"].includes(role)) {
      const bizType = role === "WORKSHOP" ? "workshop" : role === "TOW" ? "tow" : "store";
      const finalBizName = (business_name && business_name.trim()) || name.trim();
      const finalAddress = (address && address.trim()) || "La Paz, Bolivia";
      const finalZone = (zone && zone.trim()) || "Zona Central";
      const finalPhone = (phone && phone.trim()) || "+591 70000000";
      const finalSchedule = (schedule && schedule.trim()) || "Lun - Sáb · 08:30 - 18:30";

      const defaultServices =
        bizType === "workshop"
          ? ["Mantenimiento preventivo", "Frenos", "Diagnóstico computarizado"]
          : bizType === "tow"
          ? ["Auxilio mecánico", "Remolque 24/7"]
          : ["Repuestos y lubricantes"];

      const bizResult = await pool.query(
        `
        INSERT INTO businesses (
          type, name, description, zone, address, phone, schedule,
          services, nit, specialties, bay_capacity, tow_type,
          tow_capacity, has_delivery, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        RETURNING id
        `,
        [
          bizType,
          finalBizName,
          `Servicio verificado de ${ROLE_LABELS[role] || "Negocio"} en La Paz`,
          finalZone,
          finalAddress,
          finalPhone,
          finalSchedule,
          specialties && specialties.length > 0 ? specialties : defaultServices,
          nit ? nit.trim() : null,
          specialties || null,
          bay_capacity ? parseInt(bay_capacity.toString(), 10) : null,
          tow_type || null,
          tow_capacity || null,
          has_delivery || false,
          newUser.id,
        ]
      );

      // Si es taller, agregar paquetes iniciales
      if (bizType === "workshop" && bizResult.rows.length > 0) {
        const newBizId = bizResult.rows[0].id;
        for (const pkg of defaultPackages) {
          await pool.query(
            `
            INSERT INTO service_packages (
              business_id, name, category, description, includes,
              price_small, price_medium, price_large, duration_estimate, is_popular
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `,
            [
              newBizId,
              pkg.name,
              pkg.category,
              pkg.description,
              pkg.includes,
              pkg.priceSmall,
              pkg.priceMedium,
              pkg.priceLarge,
              pkg.durationEstimate,
              pkg.isPopular || false,
            ]
          );
        }
      }
    }

    // ENVIAR CONTRASEÑA AUTOGENERADA DIRECTO AL CORREO DEL USUARIO
    const roleLabel = ROLE_LABELS[role] || role;
    await sendTemporaryPasswordEmail(
      newUser.email,
      newUser.name,
      roleLabel,
      tempPassword
    );

    return NextResponse.json(
      {
        success: true,
        message: `Usuario registrado correctamente. Las credenciales de acceso fueron enviadas de forma privada y directa al correo ${newUser.email}.`,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando usuario:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "No estás autenticado",
          },
          { status: 401 }
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "No tienes permisos de administrador",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Error creando usuario en el servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}