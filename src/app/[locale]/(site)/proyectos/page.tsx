import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllProyectos, getTiposServicioConProyectos } from '@/lib/repos/proyectos';
import ProjectsClient from '@/components/pages/ProjectsClient';

export const revalidate = 86400; // ISR: revalidate every 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | AGL CONSTRUCCIONES SAS`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/proyectos',
    },
  };
}

export default async function ProjectsPage() {
  const [proyectos, tiposServicio] = await Promise.all([
    getAllProyectos(),
    getTiposServicioConProyectos(),
  ]);

  return (
    <ProjectsClient
      proyectos={proyectos}
      tiposServicio={tiposServicio}
    />
  );
}
