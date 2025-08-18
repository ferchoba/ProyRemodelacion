import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home');
  
  return {
    title: 'AGL CONSTRUCCIONES SAS - Remodelación y Construcción de Calidad',
    description: t('hero.subtitle'),
    keywords: ['remodelación', 'construcción', 'cocinas', 'baños', 'oficinas', 'residencial', 'comercial', 'Colombia'],
    openGraph: {
      title: 'AGL CONSTRUCCIONES SAS - Remodelación y Construcción',
      description: t('hero.subtitle'),
      type: 'website',
      locale: 'es_CO',
      siteName: 'AGL CONSTRUCCIONES SAS',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'AGL CONSTRUCCIONES SAS - Remodelación y Construcción',
      description: t('hero.subtitle'),
    },
    alternates: {
      canonical: '/',
    },
  };
}

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-raisin-black via-raisin-black to-outer-space/20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-1 mb-6 animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="lead mb-8 max-w-3xl mx-auto animate-slide-up">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/cotizacion"
                className="btn btn-primary btn-lg"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href="/proyectos"
                className="btn btn-secondary btn-lg"
              >
                {t('hero.cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              {t('services.title')}
            </h2>
            <p className="lead max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Link href="/servicios" className="card text-center hover:bg-outer-space/10 transition-colors">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">DEMOLICIONES</h3>
              <p className="text-quick-silver">Servicio profesional para el desmantelamiento seguro y eficiente de estructuras.</p>
            </Link>

            <Link href="/servicios" className="card text-center hover:bg-outer-space/10 transition-colors">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">ESTRUCTURA</h3>
              <p className="text-quick-silver">Levantamos el esqueleto de su edificación con precisión y máxima seguridad.</p>
            </Link>

            <Link href="/servicios" className="card text-center hover:bg-outer-space/10 transition-colors">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">ACABADOS</h3>
              <p className="text-quick-silver">Transformamos espacios en bruto en lugares funcionales y estéticos.</p>
            </Link>
          </div>

          <div className="text-center">
            <Link
              href="/servicios"
              className="btn btn-secondary"
            >
              {t('services.view_all')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-outer-space/10">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="heading-2 mb-4">
              {t('about.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-outer-space mb-2">10+</div>
              <p className="text-quick-silver">{t('about.experience')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-outer-space mb-2">100%</div>
              <p className="text-quick-silver">{t('about.quality')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-outer-space mb-2">24/7</div>
              <p className="text-quick-silver">{t('about.team')}</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-outer-space mb-2">1 Año</div>
              <p className="text-quick-silver">{t('about.guarantee')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 mb-4">
              {t('contact.title')}
            </h2>
            <p className="lead mb-8">
              {t('contact.subtitle')}
            </p>
            <Link
              href="/contacto"
              className="btn btn-primary btn-lg"
            >
              {t('contact.cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
