import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.terms');
  
  return {
    title: t('title'),
    description: 'Términos y condiciones de uso del sitio web de Algecira Construcciones.',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function TermsPage() {
  const t = useTranslations('legal.terms');

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
              {t('title')}
            </h1>
            <p className="text-quick-silver">
              {t('last_updated')}: {new Date().toLocaleDateString('es-CO', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  1. Aceptación de los términos
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos 
                  términos y condiciones de uso. Si no está de acuerdo con alguna parte de 
                  estos términos, no debe utilizar nuestro sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  2. Descripción del servicio
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Este sitio web proporciona información sobre los servicios de remodelación 
                  y construcción ofrecidos por Algecira Construcciones. La información 
                  presentada tiene carácter informativo y puede ser actualizada sin previo aviso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  3. Propiedad intelectual
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Todos los contenidos de este sitio web, incluyendo textos, imágenes, logotipos, 
                  marcas y diseños, son propiedad de Algecira Construcciones o de sus respectivos 
                  titulares y están protegidos por las leyes de propiedad intelectual.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  4. Uso del formulario de contacto
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  El uso de nuestros formularios de contacto y cotización implica la aceptación 
                  de estos términos y de nuestra política de privacidad. La información 
                  proporcionada debe ser veraz y actualizada.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  5. Limitación de responsabilidad
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Algecira Construcciones no se hace responsable por daños directos o indirectos 
                  que puedan derivarse del uso de este sitio web. La empresa se reserva el 
                  derecho de modificar o discontinuar el servicio en cualquier momento.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  6. Uso prohibido
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Queda prohibido el uso indebido de este sitio web, incluyendo pero no limitado a:
                </p>
                <ul className="list-disc list-inside text-quick-silver mt-4 space-y-2">
                  <li>Actividades ilegales o fraudulentas</li>
                  <li>Envío de spam o contenido malicioso</li>
                  <li>Intentos de acceso no autorizado</li>
                  <li>Uso que pueda dañar o sobrecargar el sistema</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  7. Disponibilidad del servicio
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Aunque nos esforzamos por mantener el sitio web disponible las 24 horas, 
                  no garantizamos la disponibilidad ininterrumpida del servicio. Pueden 
                  ocurrir interrupciones por mantenimiento, actualizaciones o causas técnicas.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  8. Modificaciones
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos y condiciones en 
                  cualquier momento. Las modificaciones entrarán en vigor inmediatamente 
                  después de su publicación en el sitio web.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  9. Ley aplicable
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Estos términos y condiciones se rigen por las leyes de Colombia. 
                  Cualquier disputa será resuelta en los tribunales competentes de Colombia.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  10. Contacto
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Para preguntas sobre estos términos y condiciones, puede contactarnos en:
                </p>
                <div className="mt-4 p-4 bg-outer-space/20 rounded-lg">
                  <p className="text-platinum font-medium">Algecira Construcciones</p>
                  <p className="text-quick-silver">Email: fercho.ba@gmail.com</p>
                  <p className="text-quick-silver">Teléfono: +57 301 257 1215</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
