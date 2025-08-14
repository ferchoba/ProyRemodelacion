import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getQuienesSomosContent } from '@/lib/repos/quienes-somos';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import SafeImage from '@/components/ui/SafeImage';

export const revalidate = 86400; // ISR: revalidate every 24 hours

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | AGL CONSTRUCCIONES SAS`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/quienes-somos',
    },
  };
}

export default async function AboutPage() {
  const t = await getTranslations('about');
  const content = await getQuienesSomosContent();

  // Fallback content if no database content is available
  const fallbackContent = {
    titulo: 'Nuestra Historia y Compromiso',
    contenido_md: `
# AGL CONSTRUCCIONES SAS

Somos una empresa especializada en **remodelación y construcción** de espacios residenciales, comerciales y de oficina. Con años de experiencia en el sector, nos hemos consolidado como líderes en transformación de espacios.

## Nuestra Misión

Transformar espacios con calidad excepcional, brindando soluciones personalizadas que superen las expectativas de nuestros clientes.

## Nuestros Valores

- **Calidad**: Utilizamos materiales de primera y técnicas especializadas
- **Compromiso**: Cumplimos con los tiempos y presupuestos acordados
- **Innovación**: Incorporamos las últimas tendencias en diseño y construcción
- **Confianza**: Construimos relaciones duraderas con nuestros clientes

## Nuestros Servicios

### Remodelaciones Integrales
Transformamos completamente sus espacios residenciales y comerciales con diseños modernos y funcionales.

### Renovaciones Especializadas
- Cocinas modernas y funcionales
- Baños con diseños contemporáneos
- Garajes optimizados

### Acabados y Mantenimiento
- Instalación profesional de pisos
- Pintura especializada
- Mantenimiento preventivo

## ¿Por qué elegirnos?

Con más de **10 años de experiencia**, hemos completado cientos de proyectos exitosos. Nuestro equipo de profesionales expertos garantiza resultados excepcionales en cada proyecto.

*Contáctanos hoy mismo para una consulta gratuita y descubre cómo podemos transformar tu espacio.*
    `,
    imagen_equipo_url: null,
  };

  const pageContent = content || fallbackContent;

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-16">
            <h1 className="heading-1 mb-4">
              {pageContent.titulo}
            </h1>
            <p className="lead">
              {t('subtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <MarkdownRenderer 
                content={pageContent.contenido_md}
                className="prose-headings:text-platinum prose-p:text-quick-silver prose-strong:text-platinum prose-li:text-quick-silver"
              />
            </div>

            {pageContent.imagen_equipo_url && (
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <SafeImage
                    src={pageContent.imagen_equipo_url}
                    alt="Equipo de AGL CONSTRUCCIONES SAS"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg"
                    priority
                  />
                </div>
              </div>
            )}
          </div>

          {!content && (
            <div className="mt-12 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Nota de desarrollo:</strong> Este contenido es de ejemplo. 
                En el Sprint 2 se configurará la base de datos con contenido real.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
