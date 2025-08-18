import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getServicioBySlug, getAllServicios } from '@/lib/repos/servicios';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import { Link } from '@/i18n/routing';

export const revalidate = 86400; // ISR: revalidate every 24 hours

interface ServiceDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateStaticParams() {
  // Generar parámetros para ambos idiomas
  const serviciosES = await getAllServicios('ES');
  const serviciosEN = await getAllServicios('EN');

  const params = [
    ...serviciosES.map((servicio) => ({
      slug: servicio.slug,
      locale: 'es',
    })),
    ...serviciosEN.map((servicio) => ({
      slug: servicio.slug,
      locale: 'en',
    })),
  ];

  return params;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const servicio = await getServicioBySlug(params.slug, params.locale);
  
  if (!servicio) {
    return {
      title: 'Servicio no encontrado',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  return {
    title: `${servicio.titulo} | Algecira Construcciones`,
    description: servicio.descripcion_corta || `Conoce más sobre nuestro servicio de ${servicio.titulo}`,
    openGraph: {
      title: `${servicio.titulo} | Algecira Construcciones`,
      description: servicio.descripcion_corta || `Conoce más sobre nuestro servicio de ${servicio.titulo}`,
      type: 'article',
      url: `${baseUrl}/servicios/${servicio.slug}`,
      images: servicio.imagen_principal_url ? [
        {
          url: servicio.imagen_principal_url,
          width: 1200,
          height: 630,
          alt: servicio.titulo,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${servicio.titulo} | AGL CONSTRUCCIONES SAS`,
      description: servicio.descripcion_corta || `Conoce más sobre nuestro servicio de ${servicio.titulo}`,
      images: servicio.imagen_principal_url ? [servicio.imagen_principal_url] : [],
    },
    alternates: {
      canonical: `/servicios/${servicio.slug}`,
    },
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const t = await getTranslations('services');
  const tContact = await getTranslations('contact');
  const tNav = await getTranslations('navigation');
  const servicio = await getServicioBySlug(params.slug, params.locale);

  if (!servicio) {
    notFound();
  }

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-quick-silver">
            <li>
              <Link href="/" className="hover:text-platinum transition-colors">
                {tNav('home')}
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/servicios" className="hover:text-platinum transition-colors">
                {t('title')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-platinum">{servicio.titulo}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            <header className="mb-8">
              <h1 className="heading-1 mb-4">
                {servicio.titulo}
              </h1>
              {servicio.descripcion_corta && (
                <p className="lead">
                  {servicio.descripcion_corta}
                </p>
              )}
            </header>

            {/* Imagen principal */}
            {servicio.imagen_principal_url && (
              <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={servicio.imagen_principal_url}
                  alt={servicio.titulo}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
            )}

            {/* Contenido en Markdown */}
            <div className="mb-8">
              <MarkdownRenderer 
                content={servicio.contenido_md}
                className="prose-headings:text-platinum prose-p:text-quick-silver prose-strong:text-platinum prose-li:text-quick-silver prose-a:text-outer-space hover:prose-a:text-quick-silver"
              />
            </div>

            {/* Etiquetas */}
            {servicio.etiquetas.length > 0 && (
              <div className="mb-8">
                <h3 className="heading-5 mb-4">{t('categories')}</h3>
                <div className="flex flex-wrap gap-2">
                  {servicio.etiquetas.map((etiqueta, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-outer-space/30 text-quick-silver rounded-full"
                    >
                      {etiqueta}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="card">
                <h3 className="heading-4 mb-4">
                  {t('interested_title')}
                </h3>
                <p className="text-quick-silver mb-6">
                  {t('interested_description')}
                </p>
                <div className="space-y-4">
                  <Link
                    href="/contacto"
                    className="btn btn-primary btn-md w-full text-center"
                  >
                    {t('request_quote')}
                  </Link>
                  <Link
                    href="/contacto"
                    className="btn btn-secondary btn-md w-full text-center"
                  >
                    {tContact('title')}
                  </Link>
                </div>
              </div>

              {/* Información adicional */}
              <div className="card">
                <h3 className="heading-5 mb-4">
                  {t('why_choose_title')}
                </h3>
                <ul className="space-y-3 text-quick-silver">
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('experience')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('quality_materials')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('warranty')}</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{t('free_quotes')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación a otros servicios */}
        <div className="mt-16 pt-8 border-t border-quick-silver/20">
          <div className="text-center">
            <Link
              href="/servicios"
              className="btn btn-ghost"
            >
              ← Ver todos los servicios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
