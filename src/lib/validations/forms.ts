import { z } from 'zod';

// Esquema de validación para formulario de contacto
export const contactFormSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  email: z
    .string()
    .email('Por favor ingresa un email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  telefono: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Opcional
      // Validar formato de teléfono colombiano
      const phoneRegex = /^(\+57|57)?[\s-]?[3][0-9]{9}$|^(\+57|57)?[\s-]?[1-8][0-9]{6,7}$/;
      return phoneRegex.test(val.replace(/[\s-]/g, ''));
    }, 'Por favor ingresa un número de teléfono válido'),
  
  mensaje: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
  
  recaptchaToken: z
    .string()
    .min(1, 'Verificación reCAPTCHA requerida'),
});

// Esquema de validación para formulario de cotización
export const quoteFormSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
  
  email: z
    .string()
    .email('Por favor ingresa un email válido')
    .max(255, 'El email no puede exceder 255 caracteres'),
  
  telefono: z
    .string()
    .min(1, 'El teléfono es requerido para cotizaciones')
    .refine((val) => {
      // Validar formato de teléfono colombiano
      const phoneRegex = /^(\+57|57)?[\s-]?[3][0-9]{9}$|^(\+57|57)?[\s-]?[1-8][0-9]{6,7}$/;
      return phoneRegex.test(val.replace(/[\s-]/g, ''));
    }, 'Por favor ingresa un número de teléfono válido'),
  
  tipoServicio: z
    .string()
    .min(1, 'Por favor selecciona un tipo de servicio'),
  
  descripcionProyecto: z
    .string()
    .min(20, 'La descripción del proyecto debe tener al menos 20 caracteres')
    .max(3000, 'La descripción no puede exceder 3000 caracteres'),
  
  presupuestoEstimado: z
    .string()
    .optional(),
  
  fechaInicio: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Opcional
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, 'La fecha de inicio debe ser hoy o en el futuro'),
  
  recaptchaToken: z
    .string()
    .min(1, 'Verificación reCAPTCHA requerida'),
});

// Tipos TypeScript derivados de los esquemas
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type QuoteFormData = z.infer<typeof quoteFormSchema>;

// Función para validar reCAPTCHA v3
export async function validateRecaptchaV3(token: string, action: string): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_V3 || '',
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: 'Verificación reCAPTCHA fallida',
      };
    }

    // Verificar score (debe ser >= 0.5 según criterios)
    if (data.score < 0.5) {
      return {
        success: false,
        score: data.score,
        error: 'Score de reCAPTCHA muy bajo, posible bot',
      };
    }

    // Verificar acción
    if (data.action !== action) {
      return {
        success: false,
        error: 'Acción de reCAPTCHA no coincide',
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (error) {
    console.error('Error validando reCAPTCHA v3:', error);
    return {
      success: false,
      error: 'Error interno validando reCAPTCHA',
    };
  }
}

// Función para validar reCAPTCHA v2 (fallback)
export async function validateRecaptchaV2(token: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_V2 || '',
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: 'Verificación reCAPTCHA fallida',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error validando reCAPTCHA v2:', error);
    return {
      success: false,
      error: 'Error interno validando reCAPTCHA',
    };
  }
}

// Función para limpiar y formatear número de teléfono
export function formatPhoneNumber(phone: string): string {
  // Remover espacios, guiones y paréntesis
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Si no tiene código de país, agregar +57
  if (!cleaned.startsWith('+57') && !cleaned.startsWith('57')) {
    return `+57${cleaned}`;
  }
  
  // Si tiene 57 pero no +, agregar +
  if (cleaned.startsWith('57') && !cleaned.startsWith('+57')) {
    return `+${cleaned}`;
  }
  
  return cleaned;
}

// Función para sanitizar texto
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Múltiples espacios a uno solo
    .replace(/[<>]/g, ''); // Remover < y > para prevenir XSS básico
}
