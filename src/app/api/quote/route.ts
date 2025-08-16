import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  quoteFormSchema,
  validateRecaptchaV3,
  validateRecaptchaV2,
  formatPhoneNumber,
  sanitizeText
} from '@/lib/validations/forms';
import {
  sendEmail,
  generateQuoteEmailTemplate,
  generateUserConfirmationTemplate
} from '@/lib/email';
import { getEmailDestino } from '@/lib/repos/parametros';
import { formRateLimit, getClientIP, applyRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Aplicar rate limiting adicional específico para formularios
    const clientIP = getClientIP(request);
    const rateLimitResult = await applyRateLimit(formRateLimit, `quote_${clientIP}`);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    
    // Validar datos del formulario
    const validationResult = quoteFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { 
      nombre, 
      email, 
      telefono, 
      tipoServicio, 
      descripcionProyecto, 
      presupuestoEstimado, 
      fechaInicio, 
      recaptchaToken 
    } = validationResult.data;

    // Validar reCAPTCHA v3 primero
    const recaptchaV3Result = await validateRecaptchaV3(recaptchaToken, 'quote');
    
    let recaptchaValid = false;
    let recaptchaScore: number | undefined;

    if (recaptchaV3Result.success) {
      recaptchaValid = true;
      recaptchaScore = recaptchaV3Result.score;
    } else {
      // Fallback a reCAPTCHA v2 si v3 falla
      console.log('reCAPTCHA v3 falló, intentando v2:', recaptchaV3Result.error);
      const recaptchaV2Result = await validateRecaptchaV2(recaptchaToken);
      
      if (recaptchaV2Result.success) {
        recaptchaValid = true;
      } else {
        return NextResponse.json(
          { error: 'Verificación reCAPTCHA fallida. Por favor intenta nuevamente.' },
          { status: 400 }
        );
      }
    }

    // Sanitizar datos
    const sanitizedData = {
      nombre: sanitizeText(nombre),
      email: email.toLowerCase().trim(),
      telefono: formatPhoneNumber(telefono),
      tipoServicio: sanitizeText(tipoServicio),
      descripcionProyecto: sanitizeText(descripcionProyecto),
      presupuestoEstimado: presupuestoEstimado ? sanitizeText(presupuestoEstimado) : null,
      fechaInicio: fechaInicio || null,
    };

    // Guardar en base de datos
    const formularioCotizacion = await db.formulario.create({
      data: {
        tipo: 'cotizacion',
        nombre: sanitizedData.nombre,
        email: sanitizedData.email,
        telefono: sanitizedData.telefono,
        tipo_servicio: sanitizedData.tipoServicio,
        descripcion: `${sanitizedData.descripcionProyecto}\n\nPresupuesto estimado: ${sanitizedData.presupuestoEstimado}\nFecha inicio deseada: ${sanitizedData.fechaInicio || 'No especificada'}`,
        recaptcha_score: recaptchaScore,
        ip: request.ip || 'unknown',
      },
    });

    // Preparar datos para emails
    const emailData = {
      nombre: sanitizedData.nombre,
      email: sanitizedData.email,
      telefono: sanitizedData.telefono,
      tipoServicio: sanitizedData.tipoServicio,
      descripcionProyecto: sanitizedData.descripcionProyecto,
      presupuestoEstimado: sanitizedData.presupuestoEstimado || undefined,
      fechaInicio: sanitizedData.fechaInicio ? new Date(sanitizedData.fechaInicio).toLocaleDateString('es-CO') : undefined,
      fecha: new Date().toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // Obtener email de destino desde parámetros
    const emailDestino = await getEmailDestino();

    // Enviar email de notificación al equipo
    const adminEmailTemplate = generateQuoteEmailTemplate(emailData);
    const adminEmailResult = await sendEmail({
      to: emailDestino,
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
      text: adminEmailTemplate.text,
    });

    // Enviar email de confirmación al usuario
    const userEmailTemplate = generateUserConfirmationTemplate({
      nombre: sanitizedData.nombre,
      tipo: 'cotizacion',
    });
    const userEmailResult = await sendEmail({
      to: sanitizedData.email,
      subject: userEmailTemplate.subject,
      html: userEmailTemplate.html,
      text: userEmailTemplate.text,
    });

    // Log de resultados de email (no fallar si emails fallan)
    if (!adminEmailResult.success) {
      console.error('Error enviando email al equipo:', adminEmailResult.error);
    }
    
    if (!userEmailResult.success) {
      console.error('Error enviando confirmación al usuario:', userEmailResult.error);
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      message: 'Solicitud de cotización enviada exitosamente',
      id: formularioCotizacion.id,
      emailsSent: {
        admin: adminEmailResult.success,
        user: userEmailResult.success,
      },
    });

  } catch (error) {
    console.error('Error procesando formulario de cotización:', error);
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor intenta nuevamente.' },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
