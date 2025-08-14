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
  const tNav = useTranslations('navigation');

  return (
    <div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-raisin-black via-raisin-black to-outer-space/20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-platinum mb-6 animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-quick-silver mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/contacto"
                className="btn btn-primary text-lg px-8 py-4"
              >
                {t('hero.cta')}
              </Link>
              <Link
                href="/proyectos"
                className="btn btn-secondary text-lg px-8 py-4"
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
            <h2 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-quick-silver max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          {/* Services Grid - Placeholder for now */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Service cards will be populated from database in Sprint 2 */}
            <div className="card text-center">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">Remodelaciones Integrales</h3>
              <p className="text-quick-silver">Transformamos completamente sus espacios residenciales y comerciales.</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">Renovaciones Especializadas</h3>
              <p className="text-quick-silver">Cocinas, baños y garajes con diseños modernos y funcionales.</p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-outer-space rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">Acabados y Mantenimiento</h3>
              <p className="text-quick-silver">Instalación de pisos y pintura profesional con acabados de calidad.</p>
            </div>
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
            <h2 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
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
            <h2 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-xl text-quick-silver mb-8">
              {t('contact.subtitle')}
            </p>
            <Link
              href="/contacto"
              className="btn btn-primary text-lg px-8 py-4"
            >
              {t('contact.cta')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
