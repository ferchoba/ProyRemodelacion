import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ProjectCardProps {
  proyecto: {
    id: number;
    slug: string;
    titulo: string;
    descripcion_md: string;
    imagen_portada_url: string | null;
    galeria_urls: string[];
    tipo_servicio_slug: string;
    fecha_finalizacion: Date | null;
    servicio: {
      titulo: string;
      slug: string;
    } | null;
  };
}

export default function ProjectCard({ proyecto }: ProjectCardProps) {
  const t = useTranslations('projects');

  // Extraer el primer párrafo de la descripción para el preview
  const getPreviewText = (markdown: string) => {
    const firstParagraph = markdown.split('\n\n')[0];
    return firstParagraph.replace(/[#*_`]/g, '').substring(0, 150) + '...';
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* Imagen */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-outer-space/20">
        {proyecto.imagen_portada_url ? (
          <Image
            src={proyecto.imagen_portada_url}
            alt={proyecto.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-quick-silver"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Badge del tipo de servicio */}
        {proyecto.servicio && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 text-xs bg-outer-space/90 text-platinum rounded-full backdrop-blur-sm">
              {proyecto.servicio.titulo}
            </span>
          </div>
        )}

        {/* Indicador de galería */}
        {proyecto.galeria_urls.length > 0 && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-raisin-black/90 text-platinum rounded-full backdrop-blur-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">{proyecto.galeria_urls.length + 1}</span>
            </div>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-platinum mb-2 group-hover:text-quick-silver transition-colors">
          {proyecto.titulo}
        </h3>
        
        <p className="text-quick-silver mb-4 line-clamp-3">
          {getPreviewText(proyecto.descripcion_md)}
        </p>

        {/* Fecha de finalización */}
        {proyecto.fecha_finalizacion && (
          <p className="text-sm text-quick-silver/70 mb-4">
            {t('completed_on')}: {new Date(proyecto.fecha_finalizacion).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        )}

        {/* Botón de acción */}
        <div className="mt-auto">
          <Link
            href={`/proyectos/${proyecto.slug}`}
            className="btn btn-primary w-full text-center"
          >
            {t('view_details')}
          </Link>
        </div>
      </div>
    </div>
  );
}
