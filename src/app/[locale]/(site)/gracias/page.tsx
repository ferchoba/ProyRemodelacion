import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('thanks');
  
  return {
    title: t('title'),
    description: t('message'),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default function ThanksPage() {
  const t = useTranslations('thanks');

  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-quick-silver mb-6">
              {t('message')}
            </p>
            <p className="text-quick-silver mb-8">
              {t('estimated_response')}
            </p>
          </div>

          <Link
            href="/"
            className="btn btn-primary"
          >
            {t('back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
}
