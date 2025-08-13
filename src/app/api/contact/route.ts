import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  contactFormSchema,
  validateRecaptchaV3,
  validateRecaptchaV2,
  formatPhoneNumber,
  sanitizeText
} from '@/lib/validations/forms';
import {
  sendEmail,
  generateContactEmailTemplate,
  generateUserConfirmationTemplate
} from '@/lib/email';
import { getEmailDestino } from '@/lib/repos/parametros';
import { formRateLimit, getClientIP, applyRateLimit, createRateLimitResponse } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Aplicar rate limiting adicional específico para formularios
    const clientIP = getClientIP(request);
    const rateLimitResult = await applyRateLimit(formRateLimit, `contact_${clientIP}`);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    
    // Validar datos del formulario
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Datos inválidos', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { nombre, email, telefono, mensaje, recaptchaToken } = validationResult.data;

    // Validar reCAPTCHA v3 primero
    const recaptchaV3Result = await validateRecaptchaV3(recaptchaToken, 'contact');
    
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
      telefono: telefono ? formatPhoneNumber(telefono) : null,
      mensaje: sanitizeText(mensaje),
    };

    // Guardar en base de datos
    const formularioContacto = await db.formularioContacto.create({
      data: {
        nombre: sanitizedData.nombre,
        email: sanitizedData.email,
        telefono: sanitizedData.telefono,
        mensaje: sanitizedData.mensaje,
        recaptcha_score: recaptchaScore,
        ip_address: request.ip || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      },
    });

    // Preparar datos para emails
    const emailData = {
      nombre: sanitizedData.nombre,
      email: sanitizedData.email,
      telefono: sanitizedData.telefono || undefined,
      mensaje: sanitizedData.mensaje,
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
    const adminEmailTemplate = generateContactEmailTemplate(emailData);
    const adminEmailResult = await sendEmail({
      to: emailDestino,
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
      text: adminEmailTemplate.text,
    });

    // Enviar email de confirmación al usuario
    const userEmailTemplate = generateUserConfirmationTemplate({
      nombre: sanitizedData.nombre,
      tipo: 'contacto',
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
      message: 'Mensaje enviado exitosamente',
      id: formularioContacto.id,
      emailsSent: {
        admin: adminEmailResult.success,
        user: userEmailResult.success,
      },
    });

  } catch (error) {
    console.error('Error procesando formulario de contacto:', error);
    
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
