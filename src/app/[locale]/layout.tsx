import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Algecira Construcciones',
    default: 'Algecira Construcciones - Remodelación y Construcción',
  },
  description: 'Especialistas en remodelación y construcción de espacios residenciales, comerciales y de oficina. Transformamos su visión en realidad con calidad excepcional.',
  keywords: ['remodelación', 'construcción', 'cocinas', 'baños', 'oficinas', 'residencial', 'comercial'],
  authors: [{ name: 'Algecira Construcciones' }],
  creator: 'Algecira Construcciones',
  publisher: 'Algecira Construcciones',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      'es': '/es',
      'en': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: '/',
    title: 'Algecira Construcciones - Remodelación y Construcción',
    description: 'Especialistas en remodelación y construcción de espacios residenciales, comerciales y de oficina.',
    siteName: 'Algecira Construcciones',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Algecira Construcciones - Remodelación y Construcción',
    description: 'Especialistas en remodelación y construcción de espacios residenciales, comerciales y de oficina.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale }
}: RootLayoutProps) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA4_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_ID}');
                `,
              }}
            />
          </>
        )}
        
        {/* reCAPTCHA v3 */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3 && (
          <script
            async
            src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V3}`}
          />
        )}

        {/* reCAPTCHA v2 (fallback) */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_V2 && (
          <script
            async
            src="https://www.google.com/recaptcha/api.js"
          />
        )}
      </head>
      <body className="min-h-screen bg-raisin-black text-platinum antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
