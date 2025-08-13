import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/forms/ContactForm';
import QuoteForm from '@/components/forms/QuoteForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Algecira Construcciones`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/contacto',
    },
  };
}

export default async function ContactPage() {
  const t = await getTranslations('contact');

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-quick-silver max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario de Contacto */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-platinum mb-4">
                  Formulario de Contacto
                </h2>
                <p className="text-quick-silver">
                  Para consultas generales, dudas o información sobre nuestros servicios.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Formulario de Cotización */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-platinum mb-4">
                  Solicitar Cotización
                </h2>
                <p className="text-quick-silver">
                  Para solicitar presupuestos detallados de proyectos específicos.
                </p>
              </div>

              <QuoteForm />
            </div>
          </div>

          {/* Información de contacto adicional */}
          <div className="mt-12 bg-gray-50 rounded-lg p-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-platinum mb-6">
                Otras formas de contacto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-platinum mb-2">Email</h4>
                  <p className="text-quick-silver">info@algeciraconstrucciones.com</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-platinum mb-2">WhatsApp</h4>
                  <p className="text-quick-silver">+57 301 257 1215</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-platinum mb-2">Ubicación</h4>
                  <p className="text-quick-silver">Algeciras, Huila, Colombia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
