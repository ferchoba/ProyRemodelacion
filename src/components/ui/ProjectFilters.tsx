'use client';

import { useTranslations } from 'next-intl';

interface ProjectFiltersProps {
  tiposServicio: Array<{
    slug: string;
    titulo: string;
    _count: {
      proyectos: number;
    };
  }>;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function ProjectFilters({ 
  tiposServicio, 
  selectedFilter, 
  onFilterChange 
}: ProjectFiltersProps) {
  const t = useTranslations('projects');

  return (
    <div className="mb-8">
      <h3 className="heading-5 mb-4">
        {t('filter_title')}
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {/* Filtro "Todos" */}
        <button
          onClick={() => onFilterChange('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedFilter === ''
              ? 'bg-outer-space text-platinum'
              : 'bg-outer-space/20 text-quick-silver hover:bg-outer-space/40 hover:text-platinum'
          }`}
        >
          {t('filter_all')}
        </button>

        {/* Filtros por tipo de servicio */}
        {tiposServicio.map((tipo) => (
          <button
            key={tipo.slug}
            onClick={() => onFilterChange(tipo.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              selectedFilter === tipo.slug
                ? 'bg-outer-space text-platinum'
                : 'bg-outer-space/20 text-quick-silver hover:bg-outer-space/40 hover:text-platinum'
            }`}
          >
            <span>{tipo.titulo}</span>
            <span className="text-xs bg-quick-silver/20 px-2 py-0.5 rounded-full">
              {tipo._count.proyectos}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
