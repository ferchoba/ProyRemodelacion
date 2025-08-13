'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import WhatsAppButton from '@/components/ui/WhatsAppButton';

const Footer = () => {
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');

  const navigation = [
    { name: tNav('home'), href: '/' },
    { name: tNav('services'), href: '/servicios' },
    { name: tNav('projects'), href: '/proyectos' },
    { name: tNav('about'), href: '/quienes-somos' },
    { name: tNav('contact'), href: '/contacto' },
    { name: tNav('quote'), href: '/cotizacion' },
  ];

  const legalLinks = [
    { name: t('privacy'), href: '/privacidad' },
    { name: t('terms'), href: '/terminos' },
  ];

  return (
    <footer className="bg-raisin-black border-t border-quick-silver/20">
      <div className="container-custom">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold text-platinum mb-4">
                Algecira
                <span className="text-quick-silver ml-1">Construcciones</span>
              </div>
              <p className="text-quick-silver mb-6 max-w-md">
                {t('description')}
              </p>
              <div className="flex space-x-4">
                <WhatsAppButton />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-platinum mb-4">
                {t('quick_links')}
              </h3>
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-quick-silver hover:text-platinum transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-platinum mb-4">
                {t('contact_info')}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-quick-silver" />
                  <a
                    href="tel:+573012571215"
                    className="text-quick-silver hover:text-platinum transition-colors duration-200"
                  >
                    +57 301 257 1215
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-quick-silver" />
                  <a
                    href="mailto:fercho.ba@gmail.com"
                    className="text-quick-silver hover:text-platinum transition-colors duration-200"
                  >
                    fercho.ba@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-quick-silver/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-quick-silver text-sm">
              © {new Date().getFullYear()} {t('company')}. {t('rights')}.
            </div>
            <div className="flex space-x-6">
              {legalLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-quick-silver hover:text-platinum transition-colors duration-200 text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
