'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('services'), href: '/servicios' },
    { name: t('projects'), href: '/proyectos' },
    { name: t('about'), href: '/quienes-somos' },
    { name: t('contact'), href: '/contacto' },
    { name: t('quote'), href: '/cotizacion' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-raisin-black/95 backdrop-blur-sm border-b border-quick-silver/20">
      <nav className="container-custom" aria-label="Global">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Algecira Construcciones</span>
              <div className="text-2xl font-bold text-platinum">
                Algecira
                <span className="text-quick-silver ml-1">Construcciones</span>
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-platinum hover:text-quick-silver transition-colors"
              onClick={() => setMobileMenuOpen(true)}
              aria-label={t('menu')}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium leading-6 text-platinum hover:text-quick-silver transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-quick-silver transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Link
              href="/cotizacion"
              className="btn btn-secondary text-sm font-semibold min-h-[40px]"
            >
              {t('quote')}
            </Link>
            <Link
              href="/contacto"
              className="btn btn-primary text-sm font-semibold min-h-[40px]"
            >
              {t('contact')}
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-raisin-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-quick-silver/20">
              <div className="flex items-center justify-between">
                <Link href="/" className="-m-1.5 p-1.5">
                  <span className="sr-only">Algecira Construcciones</span>
                  <div className="text-xl font-bold text-platinum">
                    Algecira
                    <span className="text-quick-silver ml-1">Construcciones</span>
                  </div>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-platinum hover:text-quick-silver transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t('close')}
                >
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-quick-silver/20">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-platinum hover:bg-quick-silver/10 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6 space-y-4">
                    <Link
                      href="/cotizacion"
                      className="btn btn-secondary w-full text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('quote')}
                    </Link>
                    <Link
                      href="/contacto"
                      className="btn btn-primary w-full text-center"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('contact')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
