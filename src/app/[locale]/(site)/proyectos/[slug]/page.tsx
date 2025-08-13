import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getProyectoBySlug, getAllProyectos } from '@/lib/repos/proyectos';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import ProjectGallery from '@/components/ui/ProjectGallery';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

export const revalidate = 86400; // ISR: revalidate every 24 hours

interface ProjectDetailPageProps {
  params: {
    slug: string;
    locale: string;
  };
}

export async function generateStaticParams() {
  const proyectos = await getAllProyectos();
  
  return proyectos.map((proyecto) => ({
    slug: proyecto.slug,
  }));
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const proyecto = await getProyectoBySlug(params.slug);
  
  if (!proyecto) {
    return {
      title: 'Proyecto no encontrado',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const description = proyecto.descripcion_md.replace(/[#*_`]/g, '').substring(0, 160) + '...';
  
  return {
    title: `${proyecto.titulo} | Algecira Construcciones`,
    description,
    openGraph: {
      title: `${proyecto.titulo} | Algecira Construcciones`,
      description,
      type: 'article',
      url: `${baseUrl}/proyectos/${proyecto.slug}`,
      images: proyecto.imagen_portada_url ? [
        {
          url: proyecto.imagen_portada_url,
          width: 1200,
          height: 630,
          alt: proyecto.titulo,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${proyecto.titulo} | Algecira Construcciones`,
      description,
      images: proyecto.imagen_portada_url ? [proyecto.imagen_portada_url] : [],
    },
    alternates: {
      canonical: `/proyectos/${proyecto.slug}`,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const t = await getTranslations('projects');
  const tContact = await getTranslations('contact');
  const proyecto = await getProyectoBySlug(params.slug);

  if (!proyecto) {
    notFound();
  }

  // Combinar imagen de portada con galería
  const allImages = [
    ...(proyecto.imagen_portada_url ? [proyecto.imagen_portada_url] : []),
    ...proyecto.galeria_urls,
  ];

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-quick-silver">
            <li>
              <Link href="/" className="hover:text-platinum transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/proyectos" className="hover:text-platinum transition-colors">
                {t('title')}
              </Link>
            </li>
            <li>/</li>
            <li className="text-platinum">{proyecto.titulo}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contenido principal */}
          <div className="lg:col-span-2">
            <header className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                {proyecto.servicio && (
                  <Link
                    href={`/servicios/${proyecto.servicio.slug}`}
                    className="px-3 py-1 text-sm bg-outer-space text-platinum rounded-full hover:bg-outer-space/80 transition-colors"
                  >
                    {proyecto.servicio.titulo}
                  </Link>
                )}
                {proyecto.fecha_finalizacion && (
                  <span className="text-sm text-quick-silver">
                    {t('completed_on')}: {new Date(proyecto.fecha_finalizacion).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
                {proyecto.titulo}
              </h1>
            </header>

            {/* Galería de imágenes */}
            {allImages.length > 0 && (
              <div className="mb-8">
                <ProjectGallery images={allImages} projectTitle={proyecto.titulo} />
              </div>
            )}

            {/* Contenido en Markdown */}
            <div className="mb-8">
              <MarkdownRenderer 
                content={proyecto.descripcion_md}
                className="prose-headings:text-platinum prose-p:text-quick-silver prose-strong:text-platinum prose-li:text-quick-silver prose-a:text-outer-space hover:prose-a:text-quick-silver"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="card">
                <h3 className="text-xl font-semibold text-platinum mb-4">
                  ¿Te gusta este proyecto?
                </h3>
                <p className="text-quick-silver mb-6">
                  Podemos crear algo similar para ti. Solicita una cotización gratuita y sin compromiso.
                </p>
                <div className="space-y-4">
                  <Link
                    href="/contacto"
                    className="btn btn-primary w-full text-center"
                  >
                    Solicitar cotización
                  </Link>
                  {proyecto.servicio && (
                    <Link
                      href={`/servicios/${proyecto.servicio.slug}`}
                      className="btn btn-secondary w-full text-center"
                    >
                      Ver servicio: {proyecto.servicio.titulo}
                    </Link>
                  )}
                </div>
              </div>

              {/* Información del proyecto */}
              <div className="card">
                <h3 className="text-lg font-semibold text-platinum mb-4">
                  Detalles del proyecto
                </h3>
                <div className="space-y-3 text-quick-silver">
                  {proyecto.servicio && (
                    <div>
                      <span className="font-medium text-platinum">Tipo de servicio:</span>
                      <br />
                      {proyecto.servicio.titulo}
                    </div>
                  )}
                  {proyecto.fecha_finalizacion && (
                    <div>
                      <span className="font-medium text-platinum">Fecha de finalización:</span>
                      <br />
                      {new Date(proyecto.fecha_finalizacion).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                  {allImages.length > 0 && (
                    <div>
                      <span className="font-medium text-platinum">Imágenes:</span>
                      <br />
                      {allImages.length} foto{allImages.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>

              {/* Información adicional */}
              <div className="card">
                <h3 className="text-lg font-semibold text-platinum mb-4">
                  ¿Por qué elegirnos?
                </h3>
                <ul className="space-y-3 text-quick-silver">
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Más de 10 años de experiencia</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Materiales de alta calidad</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Garantía en todos los trabajos</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-outer-space mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Presupuestos sin compromiso</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación a otros proyectos */}
        <div className="mt-16 pt-8 border-t border-quick-silver/20">
          <div className="text-center">
            <Link
              href="/proyectos"
              className="btn btn-ghost"
            >
              ← Ver todos los proyectos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
