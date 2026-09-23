import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom =
  process.env.SMTP_FROM ||
  (smtpUser ? `"AutoSOS Bolivia" <${smtpUser}>` : '"AutoSOS Asistencia" <no-reply@autosos.com>');

function getTransporter() {
  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }
  return null;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const transporter = getTransporter();

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: smtpFrom,
        to,
        subject,
        html,
        text: text || subject,
      });
      console.log(`[AutoSOS Email] Correo enviado a ${to} (ID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, simulated: false };
    } catch (error) {
      console.error("[AutoSOS Email Error] Error enviando correo vía SMTP:", error);
    }
  }

  // Fallback transparente: Log detallado en servidor
  console.log(`
┌─────────────────────────────────────────────────────────────┐
│                 AUTOSOS - NOTIFICACIÓN POR CORREO           │
├─────────────────────────────────────────────────────────────┤
│ DESTINATARIO : ${to.padEnd(44)} │
│ ASUNTO       : ${subject.padEnd(44)} │
├─────────────────────────────────────────────────────────────┤
│ (Modo de desarrollo/simulación: Para recibir correos reales  │
│  configura SMTP_HOST, SMTP_USER y SMTP_PASS en el .env)     │
└─────────────────────────────────────────────────────────────┘
${text || subject}
  `);

  return { success: true, simulated: true };
}

/**
 * Plantilla de correo para el código de verificación 2FA
 */
export async function sendVerificationCodeEmail(to: string, name: string, code: string) {
  const subject = `Tu código de verificación AutoSOS: ${code}`;
  
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAF8; color: #0C3B2E; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #DCE7DE; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0C3B2E 0%, #0F4C3A 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #FFBA00; text-decoration: none; }
        .content { padding: 36px 30px; text-align: center; }
        .title { font-size: 20px; font-weight: 800; color: #0C3B2E; margin-bottom: 12px; }
        .desc { font-size: 14px; line-height: 1.6; color: #4B5563; margin-bottom: 24px; }
        .code-box { background: #E8F0E9; border: 2px dashed #6D9773; border-radius: 16px; padding: 18px 24px; margin: 24px auto; display: inline-block; }
        .code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #0C3B2E; font-family: 'Courier New', Courier, monospace; margin: 0; }
        .badge { display: inline-block; background: #FFBA00; color: #0C3B2E; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 12px; }
        .warning { font-size: 12px; color: #6B7280; margin-top: 24px; border-top: 1px solid #E5E7EB; padding-top: 18px; }
        .footer { background: #F3F6F4; padding: 20px; text-align: center; font-size: 11px; color: #9CA3AF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ AutoSOS</div>
          <p style="margin: 6px 0 0; font-size: 13px; color: #DCE7DE;">Plataforma de Asistencia Automotriz y Talleres</p>
        </div>
        <div class="content">
          <div class="badge">Autenticación en 2 Pasos</div>
          <div class="title">Hola, ${name || "Conductor"}</div>
          <p class="desc">
            Has solicitado iniciar sesión en tu cuenta de AutoSOS. Utiliza el siguiente código de seguridad temporal para completar tu acceso:
          </p>
          <div class="code-box">
            <p class="code">${code}</p>
          </div>
          <p style="font-size: 13px; color: #6D9773; font-weight: 700; margin-top: 10px;">
            ⏱ Este código expira en 10 minutos
          </p>
          <div class="warning">
            Si no has intentado iniciar sesión en AutoSOS, te recomendamos cambiar tu contraseña de inmediato. Nunca compartas este código con nadie.
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} AutoSOS Bolivia · Soporte y Asistencia Vial
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Tu código de verificación AutoSOS es: ${code} (Expira en 10 minutos). Nunca lo compartas.`;

  return sendEmail({ to, subject, html, text });
}

/**
 * Plantilla de correo para nuevo usuario creado por Administrador
 */
export async function sendTemporaryPasswordEmail(
  to: string,
  name: string,
  roleName: string,
  tempPassword: string
) {
  const subject = `Bienvenido a AutoSOS - Tus credenciales de acceso`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${subject}</title>
      <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAF8; color: #0C3B2E; }
        .container { max-width: 560px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #DCE7DE; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0C3B2E 0%, #0F4C3A 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #FFBA00; text-decoration: none; }
        .content { padding: 36px 30px; }
        .title { font-size: 20px; font-weight: 800; color: #0C3B2E; margin-bottom: 12px; }
        .desc { font-size: 14px; line-height: 1.6; color: #4B5563; margin-bottom: 20px; }
        .cred-card { background: #F8FAF8; border: 1px solid #DCE7DE; border-radius: 14px; padding: 20px; margin: 20px 0; }
        .cred-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 13px; }
        .cred-label { font-weight: 700; color: #6B7280; }
        .cred-value { font-weight: 800; color: #0C3B2E; font-family: monospace; font-size: 14px; }
        .password-box { background: #0C3B2E; color: #FFBA00; padding: 10px 14px; border-radius: 8px; font-size: 16px; font-weight: 900; letter-spacing: 2px; text-align: center; margin-top: 8px; }
        .security-alert { background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 14px 16px; border-radius: 8px; font-size: 12px; color: #92400E; margin-top: 20px; line-height: 1.5; }
        .btn { display: block; text-align: center; background: #6D9773; color: #ffffff !important; font-weight: 800; text-decoration: none; padding: 14px 20px; border-radius: 12px; margin-top: 24px; font-size: 14px; }
        .footer { background: #F3F6F4; padding: 20px; text-align: center; font-size: 11px; color: #9CA3AF; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">⚡ AutoSOS</div>
          <p style="margin: 6px 0 0; font-size: 13px; color: #DCE7DE;">Registro de Cuenta Oficial</p>
        </div>
        <div class="content">
          <div class="title">¡Hola, ${name}! Somos AutoSOS Bolivia</div>
          <p class="desc">
            Te damos la bienvenida a <strong>AutoSOS</strong>, tu plataforma de asistencia y servicios automotrices. 
            Se ha creado tu cuenta oficial con el rol de <strong>${roleName}</strong>.
            Por estrictas políticas de seguridad y privacidad, <strong>el administrador no conoce tu contraseña</strong>; esta ha sido generada criptográficamente por el sistema.
          </p>

          <div class="cred-card">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #6D9773; margin-bottom: 12px;">
              Tus Credenciales de Acceso
            </div>
            <div class="cred-row">
              <span class="cred-label">Correo registrado:</span>
              <span class="cred-value">${to}</span>
            </div>
            <div style="margin-top: 8px;">
              <span class="cred-label" style="display:block; margin-bottom: 4px;">Contraseña temporal autogenerada:</span>
              <div class="password-box">${tempPassword}</div>
            </div>
          </div>

          <div class="security-alert">
            <strong>⚠️ Medida de Seguridad Importante:</strong> Al iniciar sesión por primera vez, te recomendamos cambiar esta contraseña temporal desde tu perfil por una clave personal y segura.
          </div>

          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" class="btn">
            Iniciar Sesión en AutoSOS
          </a>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} AutoSOS Bolivia · Sistema Automatizado de Seguridad
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Hola ${name},\nTu cuenta de AutoSOS ha sido creada con rol ${roleName}.\nEmail: ${to}\nContraseña temporal: ${tempPassword}\nPor favor inicia sesión y cambia tu contraseña por seguridad.`;

  return sendEmail({ to, subject, html, text });
}
