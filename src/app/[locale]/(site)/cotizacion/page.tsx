import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import QuoteForm from '@/components/forms/QuoteForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('quote');
  
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: `${t('title')} | AGL CONSTRUCCIONES SAS`,
      description: t('subtitle'),
    },
    alternates: {
      canonical: '/cotizacion',
    },
  };
}

export default async function QuotePage() {
  const t = await getTranslations('quote');

  return (
    <div className="section-padding">
      <div className="container-custom">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="heading-1 mb-6">
            {t('title')}
          </h1>
          <p className="lead max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Quote Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-platinum/10 border border-quick-silver/20 rounded-lg shadow-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-platinum mb-4">
                {t('form_title')}
              </h2>
              <p className="text-quick-silver">
                {t('form_description')}
              </p>
            </div>

            <QuoteForm />
          </div>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-outer-space rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">
                {t('feature_1_title')}
              </h3>
              <p className="text-quick-silver">
                {t('feature_1_description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-outer-space rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">
                {t('feature_2_title')}
              </h3>
              <p className="text-quick-silver">
                {t('feature_2_description')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-outer-space rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-platinum" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-platinum mb-2">
                {t('feature_3_title')}
              </h3>
              <p className="text-quick-silver">
                {t('feature_3_description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
