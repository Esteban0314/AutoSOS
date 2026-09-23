import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se seleccionó ningún archivo de imagen" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Formato no permitido. Solo se aceptan imágenes JPG, PNG o WEBP",
        },
        { status: 400 }
      );
    }

    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message: "El archivo es demasiado pesado. El tamaño máximo es 5MB",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar nombre único
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `veh-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

    // Directorio de destino
    const uploadDir = path.join(process.cwd(), "public", "uploads", "vehicles");
    await mkdir(uploadDir, { recursive: true });

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/vehicles/${filename}`;

    return NextResponse.json({
      success: true,
      message: "Imagen subida exitosamente",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Error subiendo imagen:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ocurrió un error al procesar la imagen del vehículo",
      },
      { status: 500 }
    );
  }
}
