'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/forms';

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className = '' }: ContactFormProps) {
  // Usar traducciones hardcodeadas por ahora para evitar errores de contexto
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'form.name': 'Nombre',
      'form.name_placeholder': 'Tu nombre completo',
      'form.email': 'Email',
      'form.email_placeholder': 'tu@email.com',
      'form.phone': 'Teléfono',
      'form.phone_placeholder': '+57 300 123 4567',
      'form.message': 'Mensaje',
      'form.message_placeholder': 'Cuéntanos en qué podemos ayudarte...',
      'form.send': 'Enviar Mensaje',
      'form.sending': 'Enviando...',
      'form.privacy_notice': 'Al enviar este formulario, aceptas nuestra política de privacidad y el tratamiento de tus datos personales.'
    };
    return translations[key] || key;
  };
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecaptchaV2, setShowRecaptchaV2] = useState(false);

  // Función para obtener token reCAPTCHA v3
  const getRecaptchaV3Token = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3!, { action: 'contact' })
            .then((token: string) => {
              resolve(token);
            })
            .catch(() => {
              resolve(null);
            });
        });
      } else {
        resolve(null);
      }
    });
  };

  // Función para obtener token reCAPTCHA v2
  const getRecaptchaV2Token = async (): Promise<string | null> => {
    // Esperar a que el contenedor exista en el DOM y el script de reCAPTCHA esté cargado
    const waitFor = async (check: () => boolean, attempts = 20, interval = 50): Promise<boolean> => {
      for (let i = 0; i < attempts; i++) {
        if (check()) return true;
        await new Promise((r) => setTimeout(r, interval));
      }
      return false;
    };

    // Asegurar que el contenedor esté presente
    const ready = await waitFor(() => typeof window !== 'undefined' && !!document.getElementById('recaptcha-v2') && !!window.grecaptcha);
    if (!ready) return null;

    return new Promise((resolve) => {
      try {
        const container = document.getElementById('recaptcha-v2')!;
        window.grecaptcha.render(container, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2!,
          callback: (token: string) => resolve(token),
          'expired-callback': () => resolve(null),
          'error-callback': () => resolve(null),
        });
      } catch (e) {
        resolve(null);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      contactFormSchema.parse({ ...formData, recaptchaToken: 'temp' });
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        if (err.path[0] !== 'recaptchaToken') {
          newErrors[err.path[0]] = err.message;
        }
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Intentar obtener token reCAPTCHA v3 primero
      let recaptchaToken = await getRecaptchaV3Token();
      
      if (!recaptchaToken) {
        // Si v3 falla, mostrar v2
        setShowRecaptchaV2(true);
        recaptchaToken = await getRecaptchaV2Token();
        
        if (!recaptchaToken) {
          setErrors({ recaptcha: 'Verificación reCAPTCHA requerida' });
          setIsSubmitting(false);
          return;
        }
      }

      // Enviar formulario
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details) {
          // Errores de validación
          const newErrors: Record<string, string> = {};
          result.details.forEach((err: any) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: result.error || 'Error enviando el mensaje' });
        }
        return;
      }

      // Éxito - redirigir a página de gracias
      router.push('/gracias');

    } catch (error) {
      console.error('Error enviando formulario:', error);
      setErrors({ general: 'Error de conexión. Por favor intenta nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`} noValidate>
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errors.general}
        </div>
      )}

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-platinum mb-2">
          {t('form.name')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre || ''}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('form.name_placeholder')}
          required
          aria-describedby={errors.nombre ? 'nombre-error' : undefined}
        />
        {errors.nombre && (
          <p id="nombre-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.nombre}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-platinum mb-2">
          {t('form.email')} <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('form.email_placeholder')}
          required
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="telefono" className="block text-sm font-medium text-platinum mb-2">
          {t('form.phone')}
        </label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          value={formData.telefono || ''}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.telefono ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('form.phone_placeholder')}
          aria-describedby={errors.telefono ? 'telefono-error' : undefined}
        />
        {errors.telefono && (
          <p id="telefono-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.telefono}
          </p>
        )}
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-platinum mb-2">
          {t('form.message')} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          value={formData.mensaje || ''}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
            errors.mensaje ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={t('form.message_placeholder')}
          required
          aria-describedby={errors.mensaje ? 'mensaje-error' : undefined}
        />
        {errors.mensaje && (
          <p id="mensaje-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.mensaje}
          </p>
        )}
      </div>

      {/* reCAPTCHA v2 (solo si es necesario) */}
      {showRecaptchaV2 && (
        <div>
          <div id="recaptcha-v2"></div>
          {errors.recaptcha && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.recaptcha}
            </p>
          )}
        </div>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        } text-white`}
      >
        {isSubmitting ? t('form.sending') : t('form.send')}
      </button>

      <p className="text-sm text-gray-600 text-center">
        {t('form.privacy_notice')}
      </p>
    </form>
  );
}
