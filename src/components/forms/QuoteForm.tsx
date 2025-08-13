'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { quoteFormSchema, type QuoteFormData } from '@/lib/validations/forms';

interface QuoteFormProps {
  className?: string;
}

export default function QuoteForm({ className = '' }: QuoteFormProps) {
  // Usar traducciones hardcodeadas por ahora para evitar errores de contexto
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'form.name': 'Nombre completo',
      'form.email': 'Email',
      'form.phone': 'Teléfono',
      'form.service_type': 'Tipo de Servicio',
      'form.project_description': 'Descripción del Proyecto',
      'form.estimated_budget': 'Presupuesto Estimado',
      'form.start_date': 'Fecha de Inicio Deseada',
      'form.send': 'Solicitar Cotización',
      'form.sending': 'Enviando Solicitud...',
      'form.privacy_notice': 'Al enviar este formulario, aceptas nuestra política de privacidad y el tratamiento de tus datos personales.'
    };
    return translations[key] || key;
  };
  const router = useRouter();
  
  const [formData, setFormData] = useState<Partial<QuoteFormData>>({
    nombre: '',
    email: '',
    telefono: '',
    tipoServicio: '',
    descripcionProyecto: '',
    presupuestoEstimado: '',
    fechaInicio: '',
  });
  
  const [servicios, setServicios] = useState<Array<{ titulo: string; slug: string }>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecaptchaV2, setShowRecaptchaV2] = useState(false);

  // Cargar servicios disponibles
  useEffect(() => {
    const loadServicios = async () => {
      try {
        // Usar servicios hardcodeados por ahora
        setServicios([
          { titulo: 'Renovación de Cocinas', slug: 'renovacion-cocinas' },
          { titulo: 'Renovación de Baños', slug: 'renovacion-banos' },
          { titulo: 'Remodelación Integral', slug: 'remodelacion-integral' },
          { titulo: 'Construcción Nueva', slug: 'construccion-nueva' },
          { titulo: 'Otro', slug: 'otro' },
        ]);
      } catch (error) {
        console.error('Error cargando servicios:', error);
      }
    };
    
    loadServicios();
  }, []);

  // Función para obtener token reCAPTCHA v3
  const getRecaptchaV3Token = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3!, { action: 'quote' })
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

    const ready = await waitFor(() => typeof window !== 'undefined' && !!document.getElementById('recaptcha-v2-quote') && !!window.grecaptcha);
    if (!ready) return null;

    return new Promise((resolve) => {
      try {
        const container = document.getElementById('recaptcha-v2-quote')!;
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      quoteFormSchema.parse({ ...formData, recaptchaToken: 'temp' });
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
      const response = await fetch('/api/quote', {
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
          setErrors({ general: result.error || 'Error enviando la solicitud' });
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

      {/* Información Personal */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-platinum mb-4">Información Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-platinum mb-2">
              Nombre completo <span className="text-red-500">*</span>
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
              placeholder="Tu nombre completo"
              required
            />
            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-platinum mb-2">
              Email <span className="text-red-500">*</span>
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
              placeholder="tu@email.com"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {/* Teléfono */}
        <div className="mt-4">
          <label htmlFor="telefono" className="block text-sm font-medium text-platinum mb-2">
            Teléfono <span className="text-red-500">*</span>
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
            placeholder="+57 300 123 4567"
            required
          />
          {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
        </div>
      </div>

      {/* Detalles del Proyecto */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-platinum mb-4">Detalles del Proyecto</h3>
        
        {/* Tipo de Servicio */}
        <div className="mb-4">
          <label htmlFor="tipoServicio" className="block text-sm font-medium text-platinum mb-2">
            Tipo de Servicio <span className="text-red-500">*</span>
          </label>
          <select
            id="tipoServicio"
            name="tipoServicio"
            value={formData.tipoServicio || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.tipoServicio ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">Selecciona un servicio</option>
            {servicios.map((servicio) => (
              <option key={servicio.slug} value={servicio.titulo}>
                {servicio.titulo}
              </option>
            ))}
          </select>
          {errors.tipoServicio && <p className="mt-1 text-sm text-red-600">{errors.tipoServicio}</p>}
        </div>

        {/* Descripción del Proyecto */}
        <div className="mb-4">
          <label htmlFor="descripcionProyecto" className="block text-sm font-medium text-platinum mb-2">
            Descripción del Proyecto <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descripcionProyecto"
            name="descripcionProyecto"
            rows={5}
            value={formData.descripcionProyecto || ''}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
              errors.descripcionProyecto ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe detalladamente tu proyecto: dimensiones, materiales preferidos, estilo, etc."
            required
          />
          {errors.descripcionProyecto && <p className="mt-1 text-sm text-red-600">{errors.descripcionProyecto}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Presupuesto Estimado */}
          <div>
            <label htmlFor="presupuestoEstimado" className="block text-sm font-medium text-platinum mb-2">
              Presupuesto Estimado (Opcional)
            </label>
            <select
              id="presupuestoEstimado"
              name="presupuestoEstimado"
              value={formData.presupuestoEstimado || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona un rango</option>
              <option value="Menos de $5M">Menos de $5M</option>
              <option value="$5M - $10M">$5M - $10M</option>
              <option value="$10M - $20M">$10M - $20M</option>
              <option value="$20M - $50M">$20M - $50M</option>
              <option value="Más de $50M">Más de $50M</option>
            </select>
          </div>

          {/* Fecha de Inicio */}
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-platinum mb-2">
              Fecha de Inicio Deseada (Opcional)
            </label>
            <input
              type="date"
              id="fechaInicio"
              name="fechaInicio"
              value={formData.fechaInicio || ''}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fechaInicio && <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>}
          </div>
        </div>
      </div>

      {/* reCAPTCHA v2 (solo si es necesario) */}
      {showRecaptchaV2 && (
        <div>
          <div id="recaptcha-v2-quote"></div>
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
        className={`w-full py-4 px-6 rounded-md font-medium text-lg transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        } text-white`}
      >
        {isSubmitting ? 'Enviando Solicitud...' : 'Solicitar Cotización'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Al enviar este formulario, aceptas nuestra política de privacidad y el tratamiento de tus datos personales.
      </p>
    </form>
  );
}
