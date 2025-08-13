import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('legal.privacy');
  
  return {
    title: t('title'),
    description: 'Política de privacidad de Algecira Construcciones. Información sobre el tratamiento de datos personales.',
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function PrivacyPage() {
  const t = useTranslations('legal.privacy');

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
                  1. Información que recopilamos
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Algecira Construcciones recopila los datos personales que usted nos proporciona 
                  voluntariamente a través de nuestros formularios de contacto y cotización, incluyendo:
                </p>
                <ul className="list-disc list-inside text-quick-silver mt-4 space-y-2">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Información sobre su proyecto o consulta</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  2. Finalidad del tratamiento
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Los datos personales recopilados tienen como finalidad principal atender sus 
                  consultas, solicitudes de cotización y brindarle información sobre nuestros 
                  servicios de remodelación y construcción.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  3. Base legal
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  El tratamiento de sus datos personales se basa en el interés legítimo del 
                  responsable para atender sus solicitudes y mantener una relación comercial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  4. Conservación de datos
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Sus datos personales se conservarán durante el tiempo necesario para gestionar 
                  su solicitud y cumplir con las obligaciones legales aplicables.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  5. Sus derechos
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Usted tiene derecho a acceder, rectificar y suprimir sus datos personales. 
                  Para ejercer estos derechos, puede contactarnos a través del correo electrónico 
                  fercho.ba@gmail.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  6. Compartir información
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  No cedemos sus datos personales a terceros, salvo cuando sea requerido por 
                  obligación legal o autoridad competente.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  7. Seguridad
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Implementamos medidas técnicas y organizativas apropiadas para proteger sus 
                  datos personales contra el acceso no autorizado, alteración, divulgación o 
                  destrucción.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-platinum mb-4">
                  8. Contacto
                </h2>
                <p className="text-quick-silver leading-relaxed">
                  Si tiene preguntas sobre esta política de privacidad o el tratamiento de sus 
                  datos personales, puede contactarnos en:
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
