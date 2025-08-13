import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllServicios } from '@/lib/repos/servicios';
import ServiceCard from '@/components/ui/ServiceCard';

export const revalidate = 86400; // ISR: revalidate every 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('services');

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | Algecira Construcciones`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/servicios',
    },
  };
}

export default async function ServicesPage() {
  const t = await getTranslations('services');
  const servicios = await getAllServicios();

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

        {servicios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <ServiceCard key={servicio.id} servicio={servicio} />
            ))}
          </div>
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
                />
              </svg>
              <h3 className="text-xl font-semibold text-platinum mb-2">
                No hay servicios disponibles
              </h3>
              <p className="text-quick-silver">
                Los servicios se cargarán desde la base de datos una vez que estén configurados.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
