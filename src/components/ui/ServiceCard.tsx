import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ServiceCardProps {
  servicio: {
    id: number;
    slug: string;
    titulo: string;
    descripcion_corta: string | null;
    imagen_principal_url: string | null;
    etiquetas: string[];
  };
}

export default function ServiceCard({ servicio }: ServiceCardProps) {
  const t = useTranslations('services');

  return (
    <div className="card group hover:scale-105 transition-all duration-300">
      {/* Imagen */}
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-outer-space/20">
        {servicio.imagen_principal_url ? (
          <Image
            src={servicio.imagen_principal_url}
            alt={servicio.titulo}
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-platinum mb-2 group-hover:text-quick-silver transition-colors">
          {servicio.titulo}
        </h3>
        
        {servicio.descripcion_corta && (
          <p className="text-quick-silver mb-4 line-clamp-3">
            {servicio.descripcion_corta}
          </p>
        )}

        {/* Etiquetas */}
        {servicio.etiquetas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {servicio.etiquetas.map((etiqueta, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-outer-space/30 text-quick-silver rounded-full"
              >
                {etiqueta}
              </span>
            ))}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <Link
            href={`/servicios/${servicio.slug}`}
            className="btn btn-primary flex-1 text-center"
          >
            {t('read_more')}
          </Link>
          <Link
            href="/contacto"
            className="btn btn-secondary flex-1 text-center"
          >
            {t('request_quote')}
          </Link>
        </div>
      </div>
    </div>
  );
}
