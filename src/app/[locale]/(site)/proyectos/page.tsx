import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');
  
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Algecira Construcciones`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/proyectos',
    },
  };
}

export default function ProjectsPage() {
  const t = useTranslations('projects');

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-quick-silver max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="text-center">
          <p className="text-quick-silver text-lg">
            Esta página se completará en el Sprint 2 con galería de proyectos y filtros.
          </p>
        </div>
      </div>
    </div>
  );
}
