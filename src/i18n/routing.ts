import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es', 'en'],

  // Used when no locale matches
  defaultLocale: 'es',

  // The `pathnames` object holds pairs of internal and
  // external paths. Based on the locale, the external
  // paths are rewritten to the shared, internal ones.
  pathnames: {
    // If all locales use the same pathname, a single
    // string or array of strings can be provided.
    '/': '/',
    '/servicios': {
      es: '/servicios',
      en: '/services'
    },
    '/servicios/[slug]': {
      es: '/servicios/[slug]',
      en: '/services/[slug]'
    },
    '/proyectos': {
      es: '/proyectos',
      en: '/projects'
    },
    '/proyectos/[slug]': {
      es: '/proyectos/[slug]',
      en: '/projects/[slug]'
    },
    '/quienes-somos': {
      es: '/quienes-somos',
      en: '/about-us'
    },
    '/contacto': {
      es: '/contacto',
      en: '/contact'
    },
    '/gracias': {
      es: '/gracias',
      en: '/thank-you'
    },
    '/privacidad': {
      es: '/privacidad',
      en: '/privacy'
    },
    '/terminos': {
      es: '/terminos',
      en: '/terms'
    }
  }
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createSharedPathnamesNavigation(routing);
