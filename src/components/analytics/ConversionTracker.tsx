'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

export default function ConversionTracker() {
  useEffect(() => {
    // Verificar que GA4 esté disponible
    if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA4_ID) {
      // Enviar evento de conversión
      window.gtag('event', 'conversion', {
        send_to: process.env.NEXT_PUBLIC_GA4_ID,
        event_category: 'form_submission',
        event_label: 'contact_or_quote',
        value: 1,
        currency: 'COP',
        custom_parameters: {
          page_location: window.location.href,
          page_title: document.title,
          timestamp: new Date().toISOString(),
        }
      });

      // También enviar un evento personalizado más específico
      window.gtag('event', 'form_completed', {
        event_category: 'engagement',
        event_label: 'thank_you_page_reached',
        value: 1,
        custom_parameters: {
          conversion_type: 'lead_generation',
          page_location: window.location.href,
          timestamp: new Date().toISOString(),
        }
      });

      console.log('Eventos de conversión GA4 enviados exitosamente');
    } else {
      console.warn('GA4 no está disponible o no configurado');
    }
  }, []);

  // Este componente no renderiza nada visible
  return null;
}
