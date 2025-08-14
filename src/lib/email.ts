import nodemailer from 'nodemailer';

// Configuración del transporter SMTP con fallback seguro en desarrollo
const hasSMTP = Boolean(process.env.SMTP_HOST || process.env.SMTP_USER);

const transporter = hasSMTP
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true' || false, // true para 465, false para otros puertos
      auth: process.env.SMTP_USER && process.env.SMTP_PASS
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    })
  : nodemailer.createTransport({
      // Transporte JSON: no envía emails reales, ideal para desarrollo y pruebas
      jsonTransport: true,
    });

// Verificar configuración SMTP
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error('Error verificando configuración SMTP:', error);
    return false;
  }
}

// Plantilla para email de contacto
export function generateContactEmailTemplate(data: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  fecha: string;
}): { subject: string; html: string; text: string } {
  const subject = `[Algecira Construcciones] Nuevo mensaje de contacto - ${data.nombre}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f8f9fa; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a365d; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nuevo Mensaje de Contacto</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Nombre:</span> ${data.nombre}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${data.email}
          </div>
          ${data.telefono ? `<div class="field"><span class="label">Teléfono:</span> ${data.telefono}</div>` : ''}
          <div class="field">
            <span class="label">Fecha:</span> ${data.fecha}
          </div>
          <div class="field">
            <span class="label">Mensaje:</span><br>
            <div style="background: white; padding: 15px; border-left: 4px solid #1a365d; margin-top: 10px;">
              ${data.mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Este mensaje fue enviado desde el formulario de contacto de Algecira Construcciones</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Nuevo Mensaje de Contacto - Algecira Construcciones

Nombre: ${data.nombre}
Email: ${data.email}
${data.telefono ? `Teléfono: ${data.telefono}` : ''}
Fecha: ${data.fecha}

Mensaje:
${data.mensaje}

---
Este mensaje fue enviado desde el formulario de contacto de Algecira Construcciones
  `;

  return { subject, html, text };
}

// Plantilla para email de cotización
export function generateQuoteEmailTemplate(data: {
  nombre: string;
  email: string;
  telefono: string;
  tipoServicio: string;
  descripcionProyecto: string;
  presupuestoEstimado?: string;
  fechaInicio?: string;
  fecha: string;
}): { subject: string; html: string; text: string } {
  const subject = `[Algecira Construcciones] Solicitud de cotización - ${data.nombre}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f8f9fa; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a365d; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .highlight { background-color: #e3f2fd; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Solicitud de Cotización</h1>
        </div>
        <div class="content">
          <div class="highlight">
            <h3>Información del Cliente</h3>
          </div>
          <div class="field">
            <span class="label">Nombre:</span> ${data.nombre}
          </div>
          <div class="field">
            <span class="label">Email:</span> ${data.email}
          </div>
          <div class="field">
            <span class="label">Teléfono:</span> ${data.telefono}
          </div>
          <div class="field">
            <span class="label">Fecha de solicitud:</span> ${data.fecha}
          </div>
          
          <div class="highlight" style="margin-top: 20px;">
            <h3>Detalles del Proyecto</h3>
          </div>
          <div class="field">
            <span class="label">Tipo de Servicio:</span> ${data.tipoServicio}
          </div>
          ${data.presupuestoEstimado ? `<div class="field"><span class="label">Presupuesto Estimado:</span> ${data.presupuestoEstimado}</div>` : ''}
          ${data.fechaInicio ? `<div class="field"><span class="label">Fecha de Inicio Deseada:</span> ${data.fechaInicio}</div>` : ''}
          <div class="field">
            <span class="label">Descripción del Proyecto:</span><br>
            <div style="background: white; padding: 15px; border-left: 4px solid #1a365d; margin-top: 10px;">
              ${data.descripcionProyecto.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Esta solicitud fue enviada desde el formulario de cotización de Algecira Construcciones</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Solicitud de Cotización - Algecira Construcciones

INFORMACIÓN DEL CLIENTE:
Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono}
Fecha de solicitud: ${data.fecha}

DETALLES DEL PROYECTO:
Tipo de Servicio: ${data.tipoServicio}
${data.presupuestoEstimado ? `Presupuesto Estimado: ${data.presupuestoEstimado}` : ''}
${data.fechaInicio ? `Fecha de Inicio Deseada: ${data.fechaInicio}` : ''}

Descripción del Proyecto:
${data.descripcionProyecto}

---
Esta solicitud fue enviada desde el formulario de cotización de Algecira Construcciones
  `;

  return { subject, html, text };
}

// Plantilla para confirmación al usuario
export function generateUserConfirmationTemplate(data: {
  nombre: string;
  tipo: 'contacto' | 'cotizacion';
}): { subject: string; html: string; text: string } {
  const isQuote = data.tipo === 'cotizacion';
  const subject = `Confirmación de ${isQuote ? 'solicitud de cotización' : 'mensaje'} - Algecira Construcciones`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f8f9fa; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .cta { background-color: #1a365d; color: white; padding: 15px; text-align: center; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Gracias por contactarnos!</h1>
        </div>
        <div class="content">
          <p>Hola ${data.nombre},</p>
          <p>Hemos recibido tu ${isQuote ? 'solicitud de cotización' : 'mensaje'} y queremos agradecerte por confiar en Algecira Construcciones.</p>
          <p>Nuestro equipo revisará tu ${isQuote ? 'solicitud' : 'mensaje'} y te responderemos en un plazo máximo de 24 horas.</p>
          ${isQuote ? '<p>Para solicitudes de cotización, nuestro equipo técnico evaluará los detalles de tu proyecto y te proporcionará una propuesta detallada.</p>' : ''}
          <div class="cta">
            <p><strong>Tiempo estimado de respuesta: 24 horas</strong></p>
          </div>
          <p>Si tienes alguna pregunta urgente, no dudes en contactarnos por WhatsApp.</p>
          <p>¡Esperamos trabajar contigo pronto!</p>
          <p><strong>El equipo de Algecira Construcciones</strong></p>
        </div>
        <div class="footer">
          <p>Algecira Construcciones - Transformando espacios, construyendo sueños</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
¡Gracias por contactarnos!

Hola ${data.nombre},

Hemos recibido tu ${isQuote ? 'solicitud de cotización' : 'mensaje'} y queremos agradecerte por confiar en AGL CONSTRUCCIONES SAS.

Nuestro equipo revisará tu ${isQuote ? 'solicitud' : 'mensaje'} y te responderemos en un plazo máximo de 24 horas.

${isQuote ? 'Para solicitudes de cotización, nuestro equipo técnico evaluará los detalles de tu proyecto y te proporcionará una propuesta detallada.' : ''}

Tiempo estimado de respuesta: 24 horas

Si tienes alguna pregunta urgente, no dudes en contactarnos por WhatsApp.

¡Esperamos trabajar contigo pronto!

El equipo de AGL CONSTRUCCIONES SAS

---
AGL CONSTRUCCIONES SAS - Transformando espacios, construyendo sueños
  `;

  return { subject, html, text };
}

// Función principal para enviar emails
export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const from = options.from || process.env.SMTP_FROM || process.env.SMTP_USER;
    
    const info = await transporter.sendMail({
      from: `"AGL CONSTRUCCIONES SAS" <${from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    console.log('Email enviado exitosamente:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error enviando email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}
