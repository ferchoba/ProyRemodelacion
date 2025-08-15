'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ProjectCard from '@/components/ui/ProjectCard';
import ProjectFilters from '@/components/ui/ProjectFilters';

interface ProjectsClientProps {
  proyectos: Array<{
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
  }>;
  tiposServicio: Array<{
    slug: string;
    titulo: string;
    _count: {
      proyectos: number;
    };
  }>;
}

export default function ProjectsClient({ proyectos, tiposServicio }: ProjectsClientProps) {
  const t = useTranslations('projects');
  const [selectedFilter, setSelectedFilter] = useState('');

  // Filtrar proyectos basado en el filtro seleccionado
  const filteredProyectos = useMemo(() => {
    if (!selectedFilter) {
      return proyectos;
    }
    return proyectos.filter(proyecto => proyecto.tipo_servicio_slug === selectedFilter);
  }, [proyectos, selectedFilter]);

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="heading-1 mb-4">
            {t('title')}
          </h1>
          <p className="lead max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {proyectos.length > 0 ? (
          <>
            {/* Filtros */}
            {tiposServicio.length > 0 && (
              <ProjectFilters
                tiposServicio={tiposServicio}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
              />
            )}

            {/* Resultados */}
            <div className="mb-8">
              <p className="text-quick-silver">
                {selectedFilter ? (
                  <>
                    {t('showing')} {filteredProyectos.length} {filteredProyectos.length === 1 ? t('project') : t('projects')}
                    {tiposServicio.find(t => t.slug === selectedFilter)?.titulo &&
                      ` ${t('of')} ${tiposServicio.find(t => t.slug === selectedFilter)?.titulo}`
                    }
                  </>
                ) : (
                  `${t('showing')} ${proyectos.length} ${proyectos.length === 1 ? t('project') : t('projects')} ${t('in_total')}`
                )}
              </p>
            </div>

            {/* Grid de proyectos */}
            {filteredProyectos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProyectos.map((proyecto) => (
                  <ProjectCard key={proyecto.id} proyecto={proyecto} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-outer-space/20 rounded-lg p-8">
                  <svg
                    className="w-16 h-16 text-quick-silver mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-platinum mb-2">
                    No se encontraron proyectos
                  </h3>
                  <p className="text-quick-silver mb-4">
                    No hay proyectos disponibles para el filtro seleccionado.
                  </p>
                  <button
                    onClick={() => setSelectedFilter('')}
                    className="btn btn-secondary"
                  >
                    Ver todos los proyectos
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="bg-outer-space/20 rounded-lg p-8">
              <svg
                className="w-16 h-16 text-quick-silver mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-platinum mb-2">
                No hay proyectos disponibles
              </h3>
              <p className="text-quick-silver">
                Los proyectos se cargarán desde la base de datos una vez que estén configurados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
